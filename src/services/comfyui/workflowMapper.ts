export interface ComfyApiNode {
  class_type: string;
  inputs: Record<string, unknown>;
  _meta?: {
    title?: string;
  };
}

export type ComfyApiWorkflow = Record<string, ComfyApiNode>;

export interface LoadImageNodeInfo {
  nodeId: string;
  title: string;
  currentImage: string;
}

export interface UploadedComfyAsset {
  name: string;
  subfolder?: string;
  type?: string;
}

const OUTPUT_CLASS_TYPES = new Set([
  'SaveImage',
  'PreviewImage',
  'SaveAnimatedWEBP',
  'SaveAnimatedPNG',
  'VHS_VideoCombine',
]);

export function parseAndValidateComfyWorkflow(raw: unknown): {
  workflow?: ComfyApiWorkflow;
  loadImageNodes: LoadImageNodeInfo[];
  hasOutputNode: boolean;
  error?: string;
} {
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        loadImageNodes: [],
        hasOutputNode: false,
        error: '유효한 JSON 형식이 아닙니다.',
      };
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return {
      loadImageNodes: [],
      hasOutputNode: false,
      error: '워크플로우 최상위 구조는 노드 ID 맵 객체여야 합니다.',
    };
  }

  const obj = parsed as Record<string, unknown>;
  if (Array.isArray(obj.nodes) && Array.isArray(obj.links)) {
    return {
      loadImageNodes: [],
      hasOutputNode: false,
      error:
        '일반 UI 워크플로우 형식입니다. ComfyUI 설정에서 Dev Mode 활성화 후 Save (API Format)으로 내보낸 JSON을 사용하세요.',
    };
  }

  const workflow: ComfyApiWorkflow = {};
  const loadImageNodes: LoadImageNodeInfo[] = [];
  let hasOutputNode = false;

  for (const [nodeId, val] of Object.entries(obj)) {
    if (!val || typeof val !== 'object' || Array.isArray(val)) continue;
    const node = val as Record<string, unknown>;
    if (typeof node.class_type !== 'string' || !node.inputs || typeof node.inputs !== 'object') {
      continue;
    }

    const inputs = { ...(node.inputs as Record<string, unknown>) };
    const meta =
      node._meta && typeof node._meta === 'object'
        ? (node._meta as { title?: string })
        : undefined;

    workflow[nodeId] = {
      class_type: node.class_type,
      inputs,
      ...(meta ? { _meta: meta } : {}),
    };

    if (node.class_type === 'LoadImage') {
      loadImageNodes.push({
        nodeId,
        title: meta?.title || `LoadImage (#${nodeId})`,
        currentImage: typeof inputs.image === 'string' ? inputs.image : '',
      });
    }

    if (OUTPUT_CLASS_TYPES.has(node.class_type)) {
      hasOutputNode = true;
    }
  }

  if (Object.keys(workflow).length === 0) {
    return {
      loadImageNodes: [],
      hasOutputNode: false,
      error: '실행 가능한 ComfyUI API 노드가 없습니다.',
    };
  }

  if (loadImageNodes.length === 0) {
    return {
      workflow,
      loadImageNodes: [],
      hasOutputNode,
      error: '워크플로우 내에 LoadImage 노드가 없습니다.',
    };
  }

  if (!hasOutputNode) {
    return {
      workflow,
      loadImageNodes,
      hasOutputNode: false,
      error: '워크플로우에 SaveImage 또는 PreviewImage 출력 노드가 없습니다.',
    };
  }

  return {
    workflow,
    loadImageNodes,
    hasOutputNode: true,
  };
}

export function injectImageIntoWorkflow(
  workflow: ComfyApiWorkflow,
  targetNodeId: string,
  asset: UploadedComfyAsset
): { workflow?: ComfyApiWorkflow; injectedPath?: string; error?: string } {
  if (!targetNodeId || !targetNodeId.trim()) {
    return { error: '이미지를 주입할 LoadImage 노드 ID를 명시적으로 선택해야 합니다.' };
  }

  const targetNode = workflow[targetNodeId];
  if (!targetNode) {
    return { error: `지정한 노드 ID(${targetNodeId})가 워크플로우에 존재하지 않습니다.` };
  }

  if (targetNode.class_type !== 'LoadImage') {
    return {
      error: `노드 #${targetNodeId}의 타입(${targetNode.class_type})이 LoadImage가 아닙니다.`,
    };
  }

  if (!asset.name || !asset.name.trim()) {
    return { error: '업로드된 이미지 파일명이 비어 있습니다.' };
  }

  const injectedPath =
    asset.subfolder && asset.subfolder.trim()
      ? `${asset.subfolder.replace(/\/$/, '')}/${asset.name}`
      : asset.name;

  const cloned: ComfyApiWorkflow = {};
  for (const [id, node] of Object.entries(workflow)) {
    cloned[id] = {
      class_type: node.class_type,
      inputs: { ...node.inputs },
      ...(node._meta ? { _meta: { ...node._meta } } : {}),
    };
  }

  cloned[targetNodeId].inputs.image = injectedPath;
  return {
    workflow: cloned,
    injectedPath,
  };
}

