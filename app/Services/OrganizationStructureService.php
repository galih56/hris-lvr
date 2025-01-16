<?php 

class OrganizationStructureService {
    function buildTree($nodes, $parentId = null)
    {
        $tree = [];
        foreach ($nodes as $node) {
            if ($node['parent_id'] === $parentId) {
                $children = $this->buildTree($nodes, $node['id']);
                if ($children) {
                    $node['children'] = $children;
                }
                $tree[] = $node;
            }
        }
        return $tree;
    }
}