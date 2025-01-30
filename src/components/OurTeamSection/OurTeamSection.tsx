import { Layout } from "../Layout/Layout";
import s from "./OurTeamSection.module.css";

export const OurTeamSection = () => {
  return (
    <section className={s.section}>
      <Layout className={s.container}>
        <div className={s.leftSide}>
          <div className={s.titleContainer}>
            <span>Команда</span>
            <span>Bilobrov</span>
            <span>Cosmetics & Clinics</span>
          </div>

          <div className={s.teamCount}>
            <span>45+</span>
            <p>Профі в команді</p>
          </div>
        </div>

        <div className={s.imageList}>
          <div className={s.imageLine}>
            <div className="h-[21.7vw]"></div>
            <div className={s.imageItem}>
              <img src="/images/our-team/Frame 1321316739.jpg" alt="" />

              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
          </div>

          <div className={s.imageLine}>
            <div className={s.imageItem}>
              <img src="/images/our-team/Component 46.jpg" alt="Viktoria" />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
            <div className={s.imageItem}>
              <img src="/images/our-team/Frame 1321316740.jpg" alt="Viktoria" />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
          </div>

          <div className={s.imageLine}>
            <div className={s.imageItem}>
              <img src="/images/our-team/Frame 1321316744.jpg" alt="Viktoria" />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
            <div className={s.imageItem}>
              <img
                src="/images/our-team/Frame 1321316741.avif"
                alt="Viktoria"
              />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
          </div>
          <div className={s.imageLine}>
            <div className={s.imageItem}>
              <img src="/images/our-team/Frame 1321316745.jpg" alt="Viktoria" />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
            <div className={s.imageItem}>
              <img src="/images/our-team/Frame 1321316742.jpg" alt="Viktoria" />
              <div className={s.hoverBlock}>
                <div className={s.name}>
                  <span>Вікторія</span>
                  <span>Білобров</span>
                </div>
                <p>Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
        <svg
          className={s.rose}
          width="425"
          height="566"
          viewBox="0 0 425 566"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_820_7343)">
            <path
              d="M188.594 293.497C182.57 295.111 176.573 292.089 171.178 289.369C167.89 287.711 164.788 286.146 161.824 285.584C157.417 284.748 153.282 285.149 149.286 285.531C142.271 286.21 135.645 286.849 128.728 280.835C123.551 276.337 121.164 270.237 118.85 264.338C117.029 259.687 115.146 254.878 111.895 250.753C109.375 247.556 105.643 242.817 103.272 238.031C102.499 240.491 102.011 243.076 101.537 245.599C100.823 249.387 100.086 253.306 98.387 256.888L98.1627 257.361C96.8834 260.077 95.2917 263.455 91.9754 264.344C91.961 264.348 91.9466 264.352 91.9322 264.356C89.1034 265.09 86.5562 264.37 84.3652 262.214C77.554 255.518 76.4022 237.105 77.7666 231.437C78.6083 227.939 80.0718 226.055 81.038 224.807C82.0104 223.553 82.1725 223.251 81.8312 222.597C81.2515 221.484 79.0934 219.667 76.0329 217.276C72.9294 214.854 64.3226 206.699 65.4333 201.166C65.8593 199.054 67.5595 197.578 70.4886 196.786L70.503 196.782C74.7015 195.657 79.8854 199.635 84.4572 203.144C86.6775 204.848 88.777 206.461 90.3834 207.171C94.4558 208.974 98.6205 209.941 103.029 210.966C105.539 211.549 108.09 212.141 110.642 212.906C108.367 208.175 103.589 205.626 98.2874 202.792C95.2564 201.174 92.3449 199.828 89.5265 198.528C80.5496 194.38 72.7979 190.799 65.5676 180.696C64.9125 179.778 49.5192 158.078 52.252 145.606C52.8935 142.671 54.4862 140.463 56.985 139.044L57.3495 138.834L57.7175 139.041C61.8475 141.362 67.1113 145.307 69.2932 151.102C72.0024 149.878 74.5951 149.774 77.0126 150.788C84.4471 153.905 88.3295 166.695 90.6469 174.335C90.8376 174.96 91.0141 175.547 91.1806 176.082C93.3539 183.07 98.5601 193.209 101.3 192.908C101.682 192.863 102.406 192.484 103.037 190.472C102.271 188.536 101.642 186.363 101.156 183.885C100.477 180.4 100.247 175.983 100.945 171.692C98.0697 166.519 93.5914 161.919 89.1987 157.408C83.9103 151.974 78.911 146.841 76.5946 140.846C73.9744 134.063 75.3671 127.147 80.8546 119.699C88.1989 109.732 88.5258 106.747 89.3903 98.7672C89.6004 96.829 89.8386 94.636 90.2109 91.9781C91.1905 85.0189 94.3901 76.4641 100.444 73.3348C103.742 71.6281 107.402 71.7912 111.322 73.8169C115.219 75.8293 116.729 79.71 118.062 83.1282C118.749 84.8841 119.394 86.5428 120.293 87.8244C121.772 89.932 123.866 92.2151 125.889 94.4205C127.924 96.6421 130.028 98.9376 131.592 101.131C134.568 105.307 136.063 108.612 136.528 111.413C137.248 110.713 137.846 109.923 138.298 109.018C140.328 104.954 139.294 98.6614 135.143 89.7808C133.225 85.6769 129.921 82.0758 126.727 78.596C122.814 74.3313 118.772 69.9195 117.298 64.5761C115.651 58.6028 116.267 53.7581 119.125 50.1792C124.305 43.702 135.471 42.8276 143.925 43.2365C146.779 43.3759 155.534 44.7359 158.092 45.3681C160.065 45.8597 161.863 45.8725 163.448 45.8843C167.524 45.913 170.745 45.9385 172.68 53.5892C174.197 59.5972 170.059 65.1963 166.052 70.6094C162.697 75.1408 159.229 79.8297 159.028 84.7255C158.742 91.6497 161.548 101.188 166.583 104.522C169.022 106.137 171.804 106.219 174.849 104.765C184.451 100.187 181.871 89.1888 179.801 80.3535C179.424 78.7464 179.068 77.2304 178.804 75.8252L178.571 74.6123C176.858 65.6543 173.987 50.6615 180.323 43.2562C189.358 32.6974 198.495 40.1955 205.837 46.2232C207.638 47.6999 209.336 49.096 210.961 50.1944C216.151 53.7038 221.672 54.8791 227.004 56.0123C232.099 57.0932 237.366 58.213 242.228 61.3656C248.962 65.7285 253.565 74.2214 252.933 81.1223C252.642 84.3148 251.113 88.6042 245.5 90.9195C243.088 91.9136 239.333 91.2197 235.356 90.4805C230.293 89.5457 224.555 88.4826 221.195 90.8938C219.552 92.0762 218.556 93.9929 218.16 96.7616C217.737 99.7073 218.172 101.72 219.454 102.744C222.633 105.277 230.872 102.089 236.889 99.7575C239.986 98.5565 242.661 97.5192 244.389 97.2996C253.569 96.1303 260.037 97.2647 264.16 100.77C269.952 105.694 270.269 114.339 270.603 123.492C270.872 130.905 271.155 138.57 274.498 144.293C275.524 146.047 276.882 147.155 278.324 148.33C280.759 150.317 283.281 152.369 283.79 157.538L283.832 157.983L283.458 158.23C279.902 160.601 277.65 158.171 275.66 156.034C273.642 153.858 271.9 151.98 268.758 153.506C267.494 154.118 266.595 155.186 266.083 156.688C264.676 160.786 266.386 166.85 267.796 169.707C268.632 171.4 269.521 173.063 270.383 174.667C275.615 184.413 280.561 193.622 268.628 204.44L268.177 204.846L267.687 204.487C260.901 199.539 259.978 191.834 259.085 184.38C258.352 178.262 257.661 172.484 253.755 168.739C250.668 165.772 249.496 165.862 249.14 166.034C247.526 166.822 248.201 173.474 248.691 178.327C249.226 183.609 249.73 188.602 248.56 190.875C246.522 194.821 225.48 211.094 221.42 211.857C221.2 211.897 220.978 211.933 220.758 211.961C215.916 217.671 210.566 223.197 206.325 226.714C203.625 228.952 200.729 230.474 198.021 231.199L198.003 231.204C200.64 232.519 202.633 234.338 203.557 236.505C204.544 238.822 205.095 243.586 197.68 249.487C191.605 254.322 174.346 257.622 166.97 257.805C155.397 258.097 146.113 248.524 137.137 239.267C129.212 231.092 121.667 223.314 113.208 222.915C112.503 226.075 110.765 227.654 108.95 229.307C107.259 230.846 105.512 232.435 104.188 235.529C104.121 235.682 104.057 235.835 103.995 235.99C106.238 241.135 110.525 246.575 113.069 249.804C116.455 254.102 118.377 259.016 120.241 263.768C122.588 269.763 124.808 275.424 129.703 279.681C136.139 285.275 142.165 284.692 149.14 284.021C153.241 283.626 157.484 283.215 162.1 284.092C165.267 284.692 168.466 286.304 171.848 288.01C178.189 291.207 184.748 294.512 191.171 290.786C195.395 288.332 197.72 282.202 199.967 276.272C201.659 271.811 203.406 267.197 205.999 263.955C215.205 252.466 217.707 248.206 209.163 235.046L208.808 234.499L209.3 234.074C214.7 229.408 221.074 229.721 227.241 230.02C232.414 230.272 237.764 230.535 242.495 227.811C244.25 226.8 246.632 224.195 249.151 221.441C254.04 216.093 259.583 210.032 264.481 210.841C266.763 211.219 268.646 213.064 270.082 216.334C271.338 219.194 271.029 222.75 269.155 226.904C265.161 235.761 255.18 244.819 249.258 246.699C236.894 250.623 221.873 243.951 215.988 240.899L216.675 239.575C222.399 242.543 236.972 249.041 248.808 245.278C254.32 243.527 264.021 234.663 267.798 226.29C269.491 222.54 269.798 219.394 268.719 216.935C267.497 214.16 265.991 212.604 264.239 212.316C260.14 211.637 254.658 217.635 250.252 222.452C247.539 225.42 245.193 227.985 243.241 229.11C238.128 232.053 232.556 231.78 227.17 231.515C221.23 231.225 215.611 230.949 210.775 234.795C219.5 248.506 216.138 253.688 207.162 264.896C204.716 267.951 203.009 272.454 201.361 276.806C199.022 282.982 196.602 289.365 191.919 292.08C190.814 292.724 189.701 293.177 188.592 293.474L188.594 293.497ZM113.445 221.452C122.384 221.944 130.101 229.903 138.206 238.258C146.958 247.285 156.008 256.619 166.929 256.344C173.941 256.169 191.008 252.917 196.75 248.349C201.745 244.376 203.622 240.491 202.186 237.12C201.18 234.766 198.586 232.86 195.225 231.697C193.318 231.81 191.602 231.455 190.238 230.599C188.23 230.38 186.118 230.389 184.014 230.675C179.649 231.265 175.473 232.778 171.438 234.238C164.585 236.719 157.495 239.284 149.344 237.38C141.741 235.607 135.763 230.713 129.983 225.978C126.82 223.39 123.551 220.711 120.061 218.59C117.764 217.192 115.417 216.136 113.05 215.283C113.341 216.499 113.505 217.831 113.531 219.296C113.544 220.077 113.515 220.792 113.448 221.448L113.445 221.452ZM70.8861 198.24L70.8753 198.243C68.5367 198.877 67.1951 199.963 66.891 201.479C66.0077 205.873 73.4267 213.368 76.9454 216.115C83.9901 221.608 84.5811 222.691 82.2142 225.74C81.2737 226.954 79.9828 228.618 79.2153 231.803C77.8672 237.415 79.2176 255.072 85.4107 261.161C87.2291 262.949 89.2393 263.524 91.5595 262.921C91.5703 262.918 91.5811 262.916 91.5919 262.913C94.2421 262.203 95.6724 259.172 96.8171 256.733L97.044 256.254C98.6623 252.845 99.3827 249.024 100.076 245.329C100.657 242.241 101.254 239.055 102.38 236.056C101.118 232.959 100.58 229.927 101.474 227.373C102.429 224.644 104.911 222.788 108.866 221.864C109.912 221.618 110.941 221.482 111.953 221.442C112.026 220.808 112.058 220.108 112.046 219.327C112.018 217.596 111.771 216.07 111.345 214.708C108.456 213.778 105.55 213.103 102.695 212.443C98.4148 211.449 93.9868 210.421 89.7833 208.56C88.0146 207.778 85.8473 206.114 83.5536 204.352C79.254 201.052 74.3808 197.312 70.8916 198.246L70.8861 198.24ZM195.499 230.198C198.325 229.959 201.807 228.55 205.376 225.592C209.304 222.333 214.195 217.329 218.735 212.062C216.093 211.951 213.409 211.094 210.793 210.261C203.923 208.071 197.436 205.999 191.548 216.302C188.279 222.02 187.89 226.746 190.497 228.945C190.577 229.013 190.661 229.079 190.751 229.144C192.427 229.348 194.025 229.708 195.5 230.202L195.499 230.198ZM178.909 230.203C180.512 229.774 182.142 229.422 183.811 229.195C185.397 228.979 186.975 228.908 188.515 228.966C187.123 226.982 186.036 222.938 190.249 215.56C196.733 204.213 204.443 206.672 211.241 208.838C214.313 209.816 217.233 210.749 220.012 210.561C223.279 206.679 226.293 202.734 228.532 199.309C232.974 192.524 233.712 184.23 230.368 178.665C227.73 174.279 222.794 172.19 216.468 172.776C213.964 173.01 211.832 174.443 209.571 175.961C206.895 177.756 204.132 179.613 200.538 179.579C196.552 179.538 193.954 177.321 191.442 175.177C189.341 173.383 187.358 171.688 184.732 171.522C179.35 171.183 178.32 172.522 176.617 174.736C175.632 176.016 174.407 177.608 172.111 179.224C171.01 179.998 170.098 180.656 169.312 181.222C164.915 184.387 164.349 184.793 157.169 186.876C155.454 187.374 153.738 187.783 152.081 188.181C146.677 189.475 142.005 190.591 140.429 193.927C139.172 196.582 139.908 200.651 142.673 206.364C143.459 207.985 145.719 210.355 148.117 212.865C152.689 217.657 157.877 223.091 156.583 227.078C155.924 229.113 153.764 230.441 149.982 231.134C142.882 232.434 135.848 224.418 130.198 217.98C127.848 215.301 125.626 212.771 123.763 211.307C121.872 209.823 120.036 208.499 118.26 207.217C112.226 202.86 107.131 199.182 103.877 192.399C103.247 193.634 102.449 194.285 101.468 194.397C96.9296 194.902 91.2992 181.479 89.7612 176.532C89.5947 175.997 89.4173 175.407 89.2247 174.774C87.1279 167.87 83.2281 155.016 76.4412 152.17C74.1932 151.227 71.8292 151.435 69.2175 152.807L68.4287 153.22L68.1582 152.369C66.3839 146.77 61.3906 142.883 57.3682 140.56C55.433 141.778 54.2378 143.54 53.7135 145.933C51.6443 155.379 60.9541 171.688 66.7846 179.837C73.7815 189.616 81.371 193.124 90.1536 197.181C92.9904 198.492 95.9237 199.847 98.9902 201.483C104.773 204.571 110.303 207.521 112.52 213.508C115.312 214.448 118.101 215.641 120.84 217.307C124.418 219.482 127.73 222.192 130.93 224.816C136.839 229.655 142.42 234.223 149.686 235.92C157.409 237.722 163.981 235.343 170.936 232.826C173.529 231.888 176.179 230.931 178.915 230.198L178.909 230.203ZM248.888 164.576C250.304 164.196 252.197 165.2 254.795 167.692C259.082 171.81 259.807 177.841 260.57 184.233C261.4 191.178 262.262 198.355 268.084 202.943C278.578 193.106 274.372 185.276 269.071 175.401C268.202 173.783 267.306 172.111 266.46 170.394C264.945 167.318 263.12 160.754 264.675 156.23C265.323 154.341 266.48 152.984 268.112 152.191C272.245 150.187 274.75 152.881 276.759 155.048C278.798 157.245 280.104 158.472 282.255 157.254C281.709 153.042 279.605 151.325 277.384 149.517C275.903 148.31 274.377 147.065 273.215 145.077C269.683 139.026 269.396 131.173 269.117 123.577C268.797 114.764 268.492 106.437 263.2 101.939C259.412 98.7226 253.326 97.6988 244.581 98.8093C243.036 99.0068 240.438 100.012 237.431 101.177C230.725 103.774 222.379 107.007 218.527 103.939C216.8 102.563 216.179 100.086 216.686 96.5768C217.139 93.4297 218.365 91.1189 220.329 89.7076C224.207 86.9221 230.278 88.0467 235.63 89.0393C239.386 89.7332 242.928 90.3916 244.936 89.5636C248.833 87.9592 251.088 84.9977 251.451 81.0092C252.035 74.6197 247.724 66.7249 241.423 62.64C236.791 59.6385 231.888 58.5951 226.699 57.493C221.223 56.3287 215.559 55.1258 210.128 51.4494C208.445 50.3084 206.719 48.893 204.893 47.3958C197.344 41.1996 189.542 34.7965 181.457 44.2469C175.588 51.1058 178.376 65.6573 180.038 74.3545L180.272 75.571C180.531 76.9428 180.883 78.4444 181.255 80.0334C183.333 88.8976 186.176 101.035 175.493 106.131C171.941 107.824 168.671 107.707 165.763 105.785C160.219 102.116 157.227 92.1753 157.538 84.6804C157.759 79.3271 161.365 74.4503 164.853 69.7365C168.825 64.3674 172.577 59.2972 171.235 53.9725C169.585 47.4397 167.272 47.4218 163.44 47.3937C161.769 47.3814 159.878 47.3665 157.733 46.8361C155.017 46.1613 146.455 44.8732 143.855 44.7469C137.22 44.4265 125.328 44.8267 120.29 51.1305C117.747 54.3122 117.222 58.7072 118.736 64.1983C120.114 69.1966 123.86 73.282 127.828 77.6055C131.1 81.1727 134.48 84.8577 136.495 89.1673C140.915 98.6174 141.911 105.144 139.637 109.706C138.924 111.138 137.925 112.306 136.697 113.284C136.727 117.627 134.161 120.815 131.11 124.608C129.106 127.096 126.833 129.919 124.924 133.569C123.586 136.122 123.165 138.801 122.796 141.168C121.927 146.698 121.177 151.475 109.579 150.39C98.1633 149.325 93.3467 139.228 93.7057 130.298L93.7142 130.056L93.8638 129.866C100.41 121.531 111.044 119.304 120.428 117.338C126.359 116.096 131.709 114.976 135.183 112.542C134.964 109.768 133.554 106.463 130.386 102.014C128.875 99.8919 126.803 97.6302 124.798 95.4471C122.742 93.2042 120.619 90.8863 119.08 88.6982C118.076 87.2708 117.398 85.532 116.68 83.6879C115.382 80.3569 114.039 76.9144 110.643 75.158C107.176 73.3666 103.975 73.2041 101.136 74.676C95.5834 77.5471 92.5804 85.914 91.6952 92.2026C91.3243 94.8369 91.0867 97.0181 90.8773 98.9445C89.9789 107.215 89.6421 110.308 82.061 120.601C70.5938 136.166 80.1525 145.986 90.2745 156.381C94.3311 160.546 98.4542 164.785 101.397 169.503C102.127 166.522 103.36 163.691 105.27 161.386C108.22 157.821 112.305 156.027 117.408 156.059C121.258 156.082 125.069 159.401 129.103 162.918C135.044 168.096 140.658 172.987 146.017 167.208C148.134 164.925 147.794 161.623 147.429 158.131C147.054 154.499 146.65 150.585 149.077 147.531C144.163 142.587 141.621 135.938 142.102 129.232C142.539 123.13 145.384 117.862 150.111 114.4C160.274 106.962 165.068 110.203 171.134 114.305C173.038 115.591 175.191 117.047 177.71 118.308C183.671 121.286 189.859 120.613 195.842 119.968C201.374 119.371 207.097 118.749 212.655 120.97C223.326 125.232 222.69 131.918 222.016 138.996C221.994 139.23 221.972 139.464 221.95 139.701C223.071 138.366 224.569 137.334 226.611 136.756C226.661 136.743 226.711 136.729 226.758 136.717C232.649 135.138 238.47 139.131 241.654 143.827C245.394 149.344 245.777 155.556 242.629 159.653C238.421 165.135 234.456 165.487 231.871 164.815C226.098 163.317 221.443 155.178 220.44 148.495C220.393 148.191 220.355 147.892 220.321 147.592C220.068 148.893 219.869 150.256 219.668 151.635C218.916 156.794 218.137 162.127 214.234 164.958L213.698 165.349L213.25 164.858C212.399 163.931 211.561 162.934 210.672 161.878C207.679 158.325 204.584 154.653 200.873 153.294C195.442 151.302 193.942 152.689 192.047 154.445C190.578 155.805 188.912 157.349 185.386 157.428C181.899 157.505 179.516 156.23 177.571 154.46C167.932 155.258 156.514 153.869 150.196 148.568C148.207 151.168 148.553 154.519 148.913 157.981C149.294 161.65 149.687 165.448 147.108 168.226C140.763 175.065 134.046 169.21 128.12 164.047C124.469 160.864 120.693 157.574 117.395 157.554C112.761 157.528 109.064 159.141 106.414 162.343C104.329 164.861 103.111 168.078 102.5 171.414C104.649 175.417 105.877 179.784 105.484 184.742C105.3 187.052 105.015 188.925 104.616 190.389C107.699 197.762 112.897 201.517 119.123 206.016C120.912 207.306 122.76 208.643 124.671 210.144C126.646 211.694 128.912 214.274 131.307 217.006C136.708 223.164 143.431 230.826 149.699 229.676C152.848 229.098 154.685 228.073 155.154 226.626C156.169 223.487 151.102 218.175 147.026 213.907C144.439 211.196 142.202 208.855 141.318 207.024C138.301 200.792 137.588 196.431 139.068 193.299C140.954 189.316 145.944 188.121 151.722 186.739C153.364 186.346 155.062 185.941 156.745 185.451C163.678 183.443 164.128 183.118 168.434 180.02C169.224 179.453 170.142 178.79 171.247 178.014C173.357 176.529 174.456 175.099 175.43 173.837C177.296 171.409 178.648 169.655 184.823 170.045C187.943 170.241 190.215 172.178 192.407 174.052C194.824 176.114 197.106 178.064 200.55 178.1C203.681 178.13 206.138 176.483 208.737 174.735C211.053 173.179 213.447 171.572 216.327 171.302C223.256 170.659 228.697 173.004 231.647 177.905C235.281 183.949 234.529 192.884 229.781 200.138C227.828 203.119 225.298 206.494 222.52 209.881C228.33 206.937 245.6 193.395 247.236 190.225C248.207 188.345 247.7 183.346 247.209 178.516C246.529 171.785 245.94 165.972 248.486 164.73C248.616 164.668 248.745 164.618 248.882 164.581L248.888 164.576ZM108.666 223.451C105.559 224.284 103.614 225.767 102.883 227.864C102.261 229.65 102.495 231.79 103.24 234.052C104.633 231.24 106.386 229.646 107.947 228.227C109.613 226.71 111.032 225.422 111.674 222.951C110.861 222.999 110.036 223.119 109.205 223.315C109.023 223.356 108.843 223.404 108.666 223.451ZM221.708 142.916C221.622 144.67 221.646 146.456 221.915 148.27C222.847 154.485 227.063 162.023 232.247 163.366C235.37 164.175 238.469 162.618 241.45 158.736C244.786 154.391 242.982 148.437 240.422 144.66C237.538 140.405 232.329 136.766 227.147 138.154C227.104 138.166 227.064 138.176 227.021 138.188C224.331 138.951 222.737 140.665 221.711 142.911L221.708 142.916ZM194.619 151.051C196.167 150.636 198.251 150.739 201.384 151.886C205.466 153.381 208.838 157.381 211.81 160.909C212.523 161.757 213.207 162.567 213.882 163.329C216.827 160.766 217.492 156.218 218.195 151.411C218.644 148.319 219.103 145.179 220.231 142.562C220.3 141.307 220.418 140.073 220.535 138.856C221.208 131.789 221.738 126.206 212.108 122.357C206.895 120.272 201.608 120.846 196.008 121.454C189.809 122.126 183.399 122.819 177.05 119.648C174.443 118.345 172.246 116.858 170.305 115.547C164.29 111.478 160.313 108.791 150.994 115.609C146.628 118.803 143.999 123.681 143.593 129.339C143.143 135.596 145.515 141.812 150.107 146.447C152.02 144.744 155.095 143.403 159.962 142.682C162.575 142.295 164.728 142.421 166.545 142.896C166.054 142.101 165.735 141.371 165.553 140.705C162.02 138.869 159.136 136.69 157.66 134.597C156.136 132.435 156.373 130.814 156.836 129.836C158 127.38 161.969 125.903 168.622 125.442C173.848 125.081 180.6 126.892 186.689 130.285C192.926 133.76 197.063 138.193 197.756 142.134C198.335 145.434 196.932 149.964 186.943 152.826C184.814 153.435 182.343 153.919 179.684 154.238C181.189 155.303 182.978 155.975 185.354 155.926C188.313 155.863 189.636 154.635 191.033 153.341C192.035 152.412 193.056 151.47 194.619 151.051ZM102.139 174.1C101.835 177.489 102.083 180.85 102.623 183.612C102.91 185.088 103.252 186.449 103.649 187.715C103.784 186.836 103.904 185.815 104.001 184.622C104.303 180.808 103.558 177.337 102.14 174.104L102.139 174.1ZM178.095 152.886C181.229 152.599 184.132 152.084 186.533 151.394C191.457 149.982 197.146 147.275 196.286 142.397C194.989 135.02 179.274 126.205 168.725 126.933C160.752 127.485 158.697 129.392 158.182 130.48C157.755 131.379 157.987 132.476 158.877 133.737C160.109 135.482 162.45 137.305 165.348 138.905C165.421 137.792 165.864 136.97 166.27 136.44C168.387 133.681 173.843 132.857 178.432 134.599C182.884 136.293 185.255 139.858 184.939 144.379L184.894 145.005L184.27 145.068C179.112 145.592 172.834 144.055 167.561 141.674C167.765 142.048 167.996 142.404 168.229 142.727L167.566 143.206C171.21 144.506 173.417 147.269 175.449 149.812C176.314 150.894 177.163 151.957 178.097 152.881L178.095 152.886ZM151.223 147.473C156.901 152.173 167.213 153.557 176.176 153.029C175.516 152.294 174.899 151.517 174.283 150.746C171.095 146.755 168.081 142.983 160.183 144.157C155.736 144.815 152.948 145.976 151.227 147.473L151.223 147.473ZM166.86 139.694C171.957 142.208 178.331 143.974 183.475 143.642C183.512 138.868 180.04 136.811 177.904 136C173.955 134.5 169.169 135.118 167.457 137.354C166.896 138.084 166.758 138.894 166.865 139.696L166.86 139.694ZM95.1831 130.598C94.9488 138.783 99.3658 147.937 109.712 148.901C119.917 149.853 120.475 146.303 121.321 140.933C121.71 138.456 122.15 135.645 123.6 132.876C125.575 129.101 127.898 126.218 129.945 123.675C132.638 120.33 134.784 117.665 135.154 114.35C131.479 116.552 126.357 117.627 120.732 118.802C111.67 120.701 101.408 122.848 95.184 130.602L95.1831 130.598Z"
              fill="#D63D44"
            />
            <path
              d="M303.951 237.741C290.835 241.255 275.207 241.723 263.665 236.177L264.315 234.834C279.763 242.258 302.808 238.56 316.648 231.318C325.547 226.657 325.465 226.162 324.673 221.4C324.424 219.893 324.111 218.017 323.959 215.53C323.8 212.857 323.551 210.944 323.352 209.408C322.629 203.833 322.895 203.554 329.67 196.367C330.14 195.867 330.647 195.334 331.186 194.758C331.736 194.17 332.303 193.582 332.87 192.998C338.477 187.186 343.771 181.693 337.233 174.467C334.934 171.927 333.269 172.415 331.339 172.983C329.842 173.422 328.145 173.919 326.3 172.755C324.311 171.501 322.618 169.617 320.98 167.794C319.377 166.013 317.722 164.169 315.815 162.947C310.311 159.422 300.786 159.293 291.574 159.164C281.256 159.023 272.344 158.9 269.606 154.17L270.899 153.422C273.213 157.42 282.145 157.543 291.596 157.673C301.017 157.803 310.757 157.936 316.624 161.689C318.699 163.02 320.424 164.938 322.094 166.794C323.737 168.622 325.287 170.345 327.099 171.491C328.375 172.295 329.495 171.968 330.919 171.548C332.922 170.961 335.415 170.227 338.345 173.463C345.818 181.72 339.512 188.259 333.947 194.029C333.387 194.611 332.827 195.193 332.279 195.776C331.74 196.349 331.233 196.886 330.764 197.386C326.393 202.02 324.418 205.961 324.84 209.21C325.041 210.769 325.293 212.707 325.455 215.434C325.598 217.846 325.903 219.678 326.151 221.151C327.084 226.758 326.656 227.76 317.345 232.635C313.472 234.661 308.891 236.417 303.954 237.74L303.951 237.741Z"
              fill="#D63D44"
            />
            <path
              d="M299.064 520.641C272.652 506.452 255.015 490.864 243.568 471.582C234.68 456.613 233.247 438.265 231.864 420.523C230.85 407.51 229.798 394.05 225.838 381.931C225.193 379.957 224.542 377.988 223.891 376.023C220.381 365.404 216.81 354.608 214.431 343.547C214.235 344.129 214.033 344.706 213.831 345.278L213.666 345.748L213.171 345.776C211.161 345.889 209.429 345.591 207.992 344.893C205.588 348.141 203.151 351.382 200.676 354.61L200.255 355.16L199.674 354.782C180.151 342.035 157.71 340.586 133.956 339.055C110.855 337.566 86.9691 336.023 66.2877 323.027L65.2037 322.346L66.3287 321.735C98.5989 304.248 171.849 325.714 197.739 348.557L196.75 349.677C184.098 338.51 159.479 327.427 134.034 321.436C106.428 314.936 82.5595 315.32 68.1985 322.445C88.3083 334.608 111.556 336.109 134.05 337.559C156.73 339.022 180.178 340.535 199.91 353.152C202.212 350.144 204.478 347.131 206.716 344.105C206.221 343.727 205.77 343.287 205.368 342.784C199.786 335.803 204.728 318.501 207.996 307.053C208.811 304.2 209.513 301.737 209.857 300.074C210.541 296.761 211.156 292.256 211.866 287.033C214.027 271.165 216.712 251.419 223.901 245.013L224.41 244.56L224.911 245.025C232.188 251.834 225.414 271.862 219.437 289.534C216.667 297.716 214.055 305.441 213.579 310.064C212.738 318.208 213.069 326.085 214.172 333.84C215.158 332.454 216.131 331.071 217.103 329.685C217.296 329.007 217.491 328.32 217.69 327.632C224.323 304.404 231.839 278.075 255.389 267.575L257.349 266.702L256.354 268.605C245.988 288.443 233.102 309.421 218.47 330.34C217.437 333.952 216.421 337.439 215.356 340.773C217.656 352.362 221.432 363.784 225.325 375.554C225.977 377.522 226.628 379.491 227.273 381.465C231.29 393.755 232.346 407.302 233.369 420.406C234.741 437.977 236.158 456.148 244.869 470.82C256.17 489.858 273.621 505.272 299.783 519.327L299.075 520.642L299.064 520.641ZM208.894 343.668C209.933 344.121 211.162 344.33 212.594 344.302C213.017 343.094 213.429 341.858 213.831 340.601C213.64 339.612 213.456 338.624 213.287 337.632C211.838 339.646 210.376 341.658 208.898 343.668L208.894 343.668ZM224.37 246.632C217.973 253.221 215.303 272.823 213.341 287.237C212.626 292.485 212.009 297.014 211.316 300.376C210.963 302.091 210.252 304.58 209.426 307.463C206.436 317.939 201.428 335.475 206.526 341.85C206.847 342.252 207.204 342.601 207.594 342.903C209.399 340.454 211.18 338 212.941 335.543C211.64 327.164 211.18 318.63 212.078 309.909C212.572 305.123 215.09 297.678 218.008 289.054C223.406 273.093 230.097 253.33 224.369 246.629L224.37 246.632ZM214.482 335.966C214.573 336.522 214.664 337.078 214.762 337.632C215.12 336.468 215.469 335.288 215.822 334.091C215.378 334.716 214.93 335.343 214.483 335.97L214.482 335.966ZM253.975 269.896C233.317 280.356 225.938 304.207 219.73 325.886C232.817 306.913 244.423 287.949 253.975 269.896Z"
              fill="#D63D44"
            />
          </g>
          <defs>
            <clipPath id="clip0_820_7343">
              <rect
                width="304"
                height="504"
                fill="white"
                transform="translate(0 79) rotate(-15)"
              />
            </clipPath>
          </defs>
        </svg>
      </Layout>
    </section>
  );
};
