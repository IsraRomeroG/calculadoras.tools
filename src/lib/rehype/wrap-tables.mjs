const DEFAULT_WRAPPER_CLASSES = ["markdown-table-wrapper"];
const DEFAULT_TABLE_CLASSES = ["markdown-table"];

export default function rehypeWrapTables(options = {}) {
  const wrapperClasses = options.wrapperClasses ?? DEFAULT_WRAPPER_CLASSES;
  const tableClasses = options.tableClasses ?? DEFAULT_TABLE_CLASSES;

  return (tree) => {
    visit(tree, null, null, (node, parent, index) => {
      if (!isElement(node, "table") || !parent || index === null) {
        return;
      }

      if (isTableWrapped(parent)) {
        addClasses(node, tableClasses);
        return;
      }

      addClasses(node, tableClasses);

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: {
          className: [...wrapperClasses],
        },
        children: [node],
      };
    });
  };
}

function visit(node, parent, index, callback) {
  callback(node, parent, index);

  if (!Array.isArray(node.children)) {
    return;
  }

  node.children.forEach((child, childIndex) => {
    visit(child, node, childIndex, callback);
  });
}

function isElement(node, tagName) {
  return node?.type === "element" && node.tagName === tagName;
}

function isTableWrapped(node) {
  return isElement(node, "div") && hasClass(node, "markdown-table-wrapper");
}

function hasClass(node, className) {
  return getClassList(node).includes(className);
}

function addClasses(node, classNames) {
  const nextClassList = new Set([...getClassList(node), ...classNames]);

  node.properties = {
    ...node.properties,
    className: [...nextClassList],
  };
}

function getClassList(node) {
  const className = node.properties?.className;

  if (Array.isArray(className)) {
    return className;
  }

  if (typeof className === "string") {
    return className.split(/\s+/).filter(Boolean);
  }

  return [];
}
