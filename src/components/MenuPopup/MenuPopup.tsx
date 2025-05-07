import { motion } from "framer-motion";
import s from "./MenuPopup.module.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useRef, useState } from "react";
import { buildMenuTree } from "../../utils/buildMenuTree";
import { Link, useLocation } from "react-router";

export const MenuPopup: React.FC<{
  onClose: () => void;
  openPopup: () => void;
}> = ({ onClose, openPopup }) => {
  const [hasMounted, setHasMounted] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

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

  const asideBottomMenuTree = buildMenuTree(asideBottomMemu);
  const asideTopMenuTree = buildMenuTree(asideTopMenu);

  const { pathname } = useLocation(); // Отримуємо поточний шлях

  useEffect(() => {
    if (hasMounted) {
      onClose();
    } else {
      setHasMounted(true);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Якщо клік був за межами модалки — закриваємо
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={s.modalOverlay}
    >
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={s.modal}
        ref={modalRef}
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
          {asideTopMenuTree.map((item) => {
            let modifiedUrl = item.url.replace(/\/$/, "");

            if (modifiedUrl.endsWith("support")) {
              modifiedUrl = "support";
            } else if (modifiedUrl.endsWith("brendy")) {
              modifiedUrl = "brendy";
            } else if (modifiedUrl.endsWith("about")) {
              modifiedUrl = "about";
            } else if (modifiedUrl.endsWith("my-account")) {
              modifiedUrl = "account";
            } else if (modifiedUrl.endsWith("certificate")) {
              modifiedUrl = "podarunkovi-sertyfikaty-20";
            } else {
              const supportMatch = modifiedUrl.match(/support\/(.+)$/);
              if (supportMatch) {
                modifiedUrl = `support#${supportMatch[1]}`;
              }
            }

            const categoryMatch = modifiedUrl.match(
              /product-category\/([^/]+)$/
            );

            if (categoryMatch) {
              modifiedUrl = `/catalog/${categoryMatch[1]}`;
            }

            return (
              <li className={s.menuItem} key={item.id}>
                {item.children.length > 0 ? (
                  <div
                    className={`${s.toggle} ${
                      openMenu === item.id && s.active
                    }`}
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
                ) : modifiedUrl === "account" ? (
                  <button onClick={openPopup} className={s.accountButton}>
                    {item.title}
                  </button>
                ) : (
                  <Link state={item.url} onClick={onClose} to={modifiedUrl}>
                    {item.title}
                  </Link>
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
                    style={{ overflow: "hidden" }}
                  >
                    {item.children.map((child) => {
                      let modifiedChildUrl = child.url.replace(/\/$/, "");

                      const lastPart = modifiedChildUrl.split("/").pop();

                      if (modifiedChildUrl.endsWith("support")) {
                        modifiedChildUrl = "support/";
                      } else {
                        const childSupportMatch =
                          modifiedChildUrl.match(/support\/(.+)$/);
                        if (childSupportMatch) {
                          modifiedChildUrl = `support#${childSupportMatch[1]}`;
                        }
                      }

                      const childCategoryMatch = modifiedChildUrl.match(
                        /product-category\/([^/]+)\/([^/]+)$/
                      );

                      if (childCategoryMatch) {
                        modifiedChildUrl = `/catalog/${childCategoryMatch[1]}/${lastPart}`;
                      }

                      return (
                        <li key={child.id}>
                          <Link
                            state={child.url}
                            onClick={onClose}
                            to={modifiedChildUrl}
                          >
                            {child.title}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>

        <ul className={s.asideBottom}>
          {asideBottomMenuTree.map((item) => {
            let modifiedUrl = item.url.replace(/\/$/, "");

            if (modifiedUrl.endsWith("support")) {
              modifiedUrl = "support";
            } else if (modifiedUrl.endsWith("brendy")) {
              modifiedUrl = "brendy";
            } else if (modifiedUrl.endsWith("about")) {
              modifiedUrl = "about";
            } else if (modifiedUrl.endsWith("my-account")) {
              modifiedUrl = "account";
            } else if (modifiedUrl.endsWith("certificate")) {
              modifiedUrl = "podarunkovi-sertyfikaty-20";
            } else if (modifiedUrl.endsWith("bonusna-systema")) {
              modifiedUrl = "bilobrov-club";
            } else {
              const supportMatch = modifiedUrl.match(/support\/(.+)$/);
              if (supportMatch) {
                modifiedUrl = `support#${supportMatch[1]}`;
              }
            }

            const categoryMatch = modifiedUrl.match(
              /product-category\/([^/]+)$/
            );

            if (categoryMatch) {
              modifiedUrl = `/catalog/${categoryMatch[1]}`;
            }

            return (
              <li className={s.menuItem} key={item.id}>
                {item.children.length > 0 ? (
                  <div
                    className={`${s.toggle} ${
                      openMenu === item.id && s.active
                    }`}
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
                ) : modifiedUrl === "account" ? (
                  <button onClick={openPopup} className={s.accountButton}>
                    {item.title}
                  </button>
                ) : (
                  <Link state={item.url} onClick={onClose} to={modifiedUrl}>
                    {item.title}
                  </Link>
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
                    style={{ overflow: "hidden" }}
                  >
                    {item.children.map((child) => {
                      let modifiedChildUrl = child.url.replace(/\/$/, "");
                      if (modifiedChildUrl.endsWith("support")) {
                        modifiedChildUrl = "support/";
                      } else {
                        const childSupportMatch =
                          modifiedChildUrl.match(/support\/(.+)$/);
                        if (childSupportMatch) {
                          modifiedChildUrl = `support#${childSupportMatch[1]}`;
                        }
                      }

                      const childCategoryMatch = modifiedChildUrl.match(
                        /product-category\/([^/]+)$/
                      );
                      if (childCategoryMatch) {
                        modifiedChildUrl = `/category/${childCategoryMatch[1]}`;
                      }

                      return (
                        <li key={child.id}>
                          <Link
                            state={child.url}
                            onClick={onClose}
                            to={modifiedChildUrl}
                          >
                            {child.title}
                          </Link>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </li>
            );
          })}
        </ul>
      </motion.div>
    </motion.div>
  );
};
