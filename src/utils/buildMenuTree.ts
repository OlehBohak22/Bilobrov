import { MenuItem } from "../store/slices/menuSlice";

export const buildMenuTree = (menuItems: MenuItem[]) => {
  const menuMap: { [key: string]: MenuItem & { children: MenuItem[] } } = {};

  menuItems.forEach((item) => {
    menuMap[item.id] = { ...item, children: [] };
  });

  const tree: (MenuItem & { children: MenuItem[] })[] = [];
  menuItems.forEach((item) => {
    const parentId = item.parent_id.toString();

    if (parentId !== "0" && menuMap[parentId]) {
      menuMap[parentId].children.push(menuMap[item.id]);
    } else {
      tree.push(menuMap[item.id]);
    }
  });

  return tree;
};
