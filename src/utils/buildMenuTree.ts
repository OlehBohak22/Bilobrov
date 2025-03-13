import { MenuItem } from "../store/slices/menuSlice";

export const buildMenuTree = (menuItems: MenuItem[]) => {
  const menuMap: { [key: string]: MenuItem & { children: MenuItem[] } } = {}; // Використовуємо string для ключів

  // Створюємо об'єкти для кожного елемента та додаємо поле `children`
  menuItems.forEach((item) => {
    menuMap[item.id] = { ...item, children: [] };
  });

  // Формуємо дерево меню
  const tree: (MenuItem & { children: MenuItem[] })[] = [];
  menuItems.forEach((item) => {
    // Приводимо item.parent_id до типу string і використовуємо його як ключ
    const parentId = item.parent_id.toString();

    if (parentId !== "0" && menuMap[parentId]) {
      menuMap[parentId].children.push(menuMap[item.id]);
    } else {
      tree.push(menuMap[item.id]);
    }
  });

  return tree;
};
