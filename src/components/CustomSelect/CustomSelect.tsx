import React, { useState, useRef, useEffect } from "react";
import s from "./CustomSelect.module.css";

interface CustomSelectProps {
  isStreet?: boolean;
  isWarehouses?: boolean;
  novaIcon: boolean;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  isStreet,
  isWarehouses,
  novaIcon,
  options,
  value,
  onChange,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().startsWith(search.toLowerCase())
  );

  return (
    <div ref={selectRef} className={`${s.select} ${className}`}>
      <div className={s.selectHead} onClick={() => setOpen(!open)}>
        <p>
          {novaIcon && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.2317 7.34919C19.3043 7.32722 19.3998 7.37117 19.4953 7.49204C19.4953 7.49204 19.4953 7.49204 23.8116 11.5429C24.0637 11.7846 24.0637 12.1509 23.8116 12.3304C23.8116 12.3304 23.8116 12.3304 19.4953 16.4435C19.3998 16.5644 19.3043 16.5937 19.2317 16.5571C19.1591 16.5204 19.1133 16.4142 19.1133 16.2604V7.6129C19.1133 7.46274 19.1591 7.37117 19.2317 7.34919Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.8475 0.599609H12.1531L12.4472 0.716814C12.4472 0.716814 12.4472 0.716814 16.8895 4.95082C17.0805 5.19256 17.0156 5.37569 16.6985 5.37569C16.6985 5.37569 16.6985 5.37569 14.8574 5.37569C14.5404 5.37569 14.2883 5.61742 14.2883 5.92142C14.2883 5.92142 14.2883 5.92142 14.2883 9.06397C14.2883 9.36796 14.0324 9.6097 13.6504 9.6097C13.6504 9.6097 13.6504 9.6097 10.4151 9.6097C10.098 9.6097 9.84211 9.36796 9.84211 9.06397C9.84211 9.06397 9.84211 9.06397 9.84211 5.92142C9.84211 5.61742 9.59001 5.37569 9.26915 5.37569H7.30199C6.98495 5.37569 6.92001 5.19256 7.111 4.95082C7.111 4.95082 7.111 4.95082 11.5572 0.716814L11.8475 0.599609Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.88735 7.25889C4.96757 7.29552 5.01722 7.40173 5.01722 7.55557V16.3825C5.01722 16.5364 4.96757 16.6279 4.88735 16.6572C4.81096 16.6865 4.70019 16.6572 4.57031 16.5657C4.57031 16.5657 4.57031 16.5657 0.189077 12.3316C-0.0630256 12.1522 -0.0630256 11.7859 0.189077 11.5442C0.189077 11.5442 0.189077 11.5442 4.57031 7.37243C4.70019 7.25157 4.81096 7.22227 4.88735 7.25889Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.4126 14.207C10.4126 14.207 10.4126 14.207 13.648 14.207C14.0299 14.207 14.2858 14.4488 14.2858 14.7528C14.2858 14.7528 14.2858 14.7528 14.2858 18.0784C14.2858 18.441 14.5379 18.6828 14.855 18.6828H16.57C16.8871 18.6828 17.0131 18.8622 16.761 19.0454C16.761 19.0454 16.761 19.0454 12.4447 23.2171C12.3149 23.338 12.1583 23.4003 11.9978 23.4003C11.8412 23.4003 11.6808 23.338 11.5547 23.2171C11.5547 23.2171 11.5547 23.2171 7.23843 19.0454C6.98251 18.8622 7.10856 18.6828 7.4256 18.6828C7.4256 18.6828 7.4256 18.6828 9.26671 18.6828C9.58757 18.6828 9.83967 18.441 9.83967 18.0784C9.83967 18.0784 9.83967 18.0784 9.83967 14.7528C9.83967 14.4488 10.0956 14.207 10.4126 14.207Z"
              />
            </svg>
          )}
          {value ||
            (isWarehouses && "Оберіть відділення") ||
            (isStreet && "Оберіть вулицю") ||
            (!novaIcon && "Обери своє місто")}
        </p>
        <svg
          className={`${open && s.rotate}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="black"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {open && (
        <div className="absolute z-10 left-0 w-full bg-white mt-1 shadow-lg">
          {!novaIcon && (
            <input
              type="text"
              placeholder="Пошук..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          )}

          <div className={s.optionsList}>
            {filteredOptions.map((option, index) => (
              <div
                className={s.selectOption}
                key={index}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setSearch("");
                }}
              >
                {novaIcon && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M19.2317 7.34919C19.3043 7.32722 19.3998 7.37117 19.4953 7.49204C19.4953 7.49204 19.4953 7.49204 23.8116 11.5429C24.0637 11.7846 24.0637 12.1509 23.8116 12.3304C23.8116 12.3304 23.8116 12.3304 19.4953 16.4435C19.3998 16.5644 19.3043 16.5937 19.2317 16.5571C19.1591 16.5204 19.1133 16.4142 19.1133 16.2604V7.6129C19.1133 7.46274 19.1591 7.37117 19.2317 7.34919Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.8475 0.599609H12.1531L12.4472 0.716814C12.4472 0.716814 12.4472 0.716814 16.8895 4.95082C17.0805 5.19256 17.0156 5.37569 16.6985 5.37569C16.6985 5.37569 16.6985 5.37569 14.8574 5.37569C14.5404 5.37569 14.2883 5.61742 14.2883 5.92142C14.2883 5.92142 14.2883 5.92142 14.2883 9.06397C14.2883 9.36796 14.0324 9.6097 13.6504 9.6097C13.6504 9.6097 13.6504 9.6097 10.4151 9.6097C10.098 9.6097 9.84211 9.36796 9.84211 9.06397C9.84211 9.06397 9.84211 9.06397 9.84211 5.92142C9.84211 5.61742 9.59001 5.37569 9.26915 5.37569H7.30199C6.98495 5.37569 6.92001 5.19256 7.111 4.95082C7.111 4.95082 7.111 4.95082 11.5572 0.716814L11.8475 0.599609Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.88735 7.25889C4.96757 7.29552 5.01722 7.40173 5.01722 7.55557V16.3825C5.01722 16.5364 4.96757 16.6279 4.88735 16.6572C4.81096 16.6865 4.70019 16.6572 4.57031 16.5657C4.57031 16.5657 4.57031 16.5657 0.189077 12.3316C-0.0630256 12.1522 -0.0630256 11.7859 0.189077 11.5442C0.189077 11.5442 0.189077 11.5442 4.57031 7.37243C4.70019 7.25157 4.81096 7.22227 4.88735 7.25889Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10.4126 14.207C10.4126 14.207 10.4126 14.207 13.648 14.207C14.0299 14.207 14.2858 14.4488 14.2858 14.7528C14.2858 14.7528 14.2858 14.7528 14.2858 18.0784C14.2858 18.441 14.5379 18.6828 14.855 18.6828H16.57C16.8871 18.6828 17.0131 18.8622 16.761 19.0454C16.761 19.0454 16.761 19.0454 12.4447 23.2171C12.3149 23.338 12.1583 23.4003 11.9978 23.4003C11.8412 23.4003 11.6808 23.338 11.5547 23.2171C11.5547 23.2171 11.5547 23.2171 7.23843 19.0454C6.98251 18.8622 7.10856 18.6828 7.4256 18.6828C7.4256 18.6828 7.4256 18.6828 9.26671 18.6828C9.58757 18.6828 9.83967 18.441 9.83967 18.0784C9.83967 18.0784 9.83967 18.0784 9.83967 14.7528C9.83967 14.4488 10.0956 14.207 10.4126 14.207Z"
                    />
                  </svg>
                )}
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-2 text-gray-500">Нічого не знайдено</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
