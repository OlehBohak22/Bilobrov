import { motion } from "framer-motion";
import s from "./MenuPopup.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { MenuItem } from "../../store/slices/menuSlice";
import { useState } from "react";

export const MenuPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const asideTopMenu = useSelector(
    (state: RootState) => state.menu.asideTopMenu?.items || []
  );

  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const toggleSubMenu = (id: number) => {
    setOpenMenu(openMenu === id ? null : id); // Закриваємо підменю при повторному кліку
  };

  const asideBottomMemu = useSelector(
    (state: RootState) => state.menu.asideBottomMenu?.items || []
  );

  const buildMenuTree = (menuItems: MenuItem[]) => {
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

  const asideBottomMenuTree = buildMenuTree(asideBottomMemu);
  const asideTopMenuTree = buildMenuTree(asideTopMenu);

  return (
    <div className={s.modalOverlay}>
      <motion.div
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={s.modal}
      >
        <div className={s.menuHeader}>
          <p>Меню</p>
          <button onClick={onClose}>
            <svg
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M39 13L13 39M13 13L39 39"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <ul className={s.asideTop}>
          {asideTopMenuTree.map((item) => (
            <li key={item.id}>
              {item.children.length > 0 ? (
                <div
                  className={`${s.toggle} ${openMenu && s.active}`}
                  onClick={() => toggleSubMenu(item.id)}
                >
                  {item.title}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.4">
                      <path
                        d="M19 8.5L12 15.5L5 8.5"
                        strokeWidth="2"
                        strokeLinecap="square"
                      />
                    </g>
                  </svg>
                </div>
              ) : (
                <a href={item.url}>{item.title}</a>
              )}

              {item.children.length > 0 && openMenu === item.id && (
                <motion.ul
                  className={s.subMenu}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openMenu === item.id ? "auto" : 0,
                    opacity: openMenu === item.id ? 1 : 0,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }} // Приховуємо вміст, поки анімація відбувається
                >
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a href={child.url}>{child.title}</a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>

        <ul className={s.asideBottom}>
          {asideBottomMenuTree.map((item) => (
            <li key={item.id}>
              <a href={item.url}>{item.title}</a>
              {item.children.length > 0 && (
                <motion.ul
                  className={s.subMenu}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a href={child.url}>{child.title}</a>
                    </li>
                  ))}
                </motion.ul>
              )}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};
