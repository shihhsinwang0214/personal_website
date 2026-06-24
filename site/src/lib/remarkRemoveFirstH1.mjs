export default function remarkRemoveFirstH1() {
  return (tree) => {
    if (!Array.isArray(tree.children)) return;
    const index = tree.children.findIndex((node) => node.type === 'heading' && node.depth === 1);
    if (index >= 0) tree.children.splice(index, 1);
  };
}
