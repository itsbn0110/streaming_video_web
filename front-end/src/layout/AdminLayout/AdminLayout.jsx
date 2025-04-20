import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import {
  ChevronDown,
  Film,
  User,
  Users,
  FileText,
  Folder,
  BarChart2,
  ShoppingBag,
} from "lucide-react";
import adminRouteConfig from "@/config/adminRoutes";
const cx = classNames.bind(styles);

const AdminLayout = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    phim: true,
    daodien: false,
    dienvien: false,
    theloai: false,
    users: false,
    baiviet: false,
    donhang: false,
  });

  const toggleMenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={cx("admin-container")}>
      <div className={cx("sidebar")}>
        <div className={cx("logo")}>
          <h1>ITLU ADMIN</h1>
        </div>

        <nav className={cx("nav-menu")}>
          <Link
            to="/admin"
            className={cx("menu-item", {
              active: location.pathname === "/admin",
            })}
          >
            <BarChart2 size={20} />
            <span>Dashboard</span>
          </Link>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", { active: isActive("/admin/phim") })}
              onClick={() => toggleMenu("phim")}
            >
              <div className={cx("menu-title")}>
                <Film size={20} />
                <span>Phim</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.phim })}
              />
            </div>

            {expandedMenus.phim && (
              <div className={cx("submenu")}>
                <Link
                  to={adminRouteConfig.list}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.list),
                  })}
                >
                  Danh sách phim
                </Link>
                <Link
                  to={adminRouteConfig.createFilm}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.createFilm),
                  })}
                >
                  Tạo phim
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", {
                active: isActive("/admin/dao-dien"),
              })}
              onClick={() => toggleMenu("daodien")}
            >
              <div className={cx("menu-title")}>
                <Users size={20} />
                <span>Đạo diễn</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.daodien })}
              />
            </div>

            {expandedMenus.daodien && (
              <div className={cx("submenu")}>
                <Link
                  to={adminRouteConfig.listDirectors}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.listDirectors),
                  })}
                >
                  Danh sách đạo diễn
                </Link>
                <Link
                  to={adminRouteConfig.createDirector}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.createDirector),
                  })}
                >
                  Tạo đạo diễn
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", {
                active: isActive("/admin/dien-vien"),
              })}
              onClick={() => toggleMenu("dienvien")}
            >
              <div className={cx("menu-title")}>
                <Users size={20} />
                <span>Diễn viên</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.dienvien })}
              />
            </div>

            {expandedMenus.dienvien && (
              <div className={cx("submenu")}>
                <Link
                  to={adminRouteConfig.listActors}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.listActors),
                  })}
                >
                  Danh sách diễn viên
                </Link>
                <Link
                  to={adminRouteConfig.createActor}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.createActor),
                  })}
                >
                  Tạo diễn viên
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", {
                active: isActive("/admin/the-loai"),
              })}
              onClick={() => toggleMenu("theloai")}
            >
              <div className={cx("menu-title")}>
                <Folder size={20} />
                <span>Thể loại & Quốc gia</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.theloai })}
              />
            </div>

            {expandedMenus.theloai && (
              <div className={cx("submenu")}>
                <Link
                  to="/admin/the-loai/danh-sach"
                  className={cx("submenu-item", {
                    active: isActive("/admin/the-loai/danh-sach"),
                  })}
                >
                  Danh sách thể loại
                </Link>
                <Link
                  to="/admin/quoc-gia/danh-sach"
                  className={cx("submenu-item", {
                    active: isActive("/admin/quoc-gia/danh-sach"),
                  })}
                >
                  Danh sách quốc gia
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", { active: isActive("/admin/user") })}
              onClick={() => toggleMenu("users")}
            >
              <div className={cx("menu-title")}>
                <User size={20} />
                <span>User</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.users })}
              />
            </div>

            {expandedMenus.users && (
              <div className={cx("submenu")}>
                <Link
                  to={adminRouteConfig.listUsers}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.createUsers),
                  })}
                >
                  Danh sách người dùng
                </Link>
                <Link
                  to={adminRouteConfig.createUsers}
                  className={cx("submenu-item", {
                    active: isActive(adminRouteConfig.createUsers),
                  })}
                >
                  Tạo người dùng
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", {
                active: isActive("/admin/bai-viet"),
              })}
              onClick={() => toggleMenu("baiviet")}
            >
              <div className={cx("menu-title")}>
                <FileText size={20} />
                <span>Bài viết</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.baiviet })}
              />
            </div>

            {expandedMenus.baiviet && (
              <div className={cx("submenu")}>
                <Link
                  to="/admin/bai-viet/danh-sach"
                  className={cx("submenu-item", {
                    active: isActive("/admin/bai-viet/danh-sach"),
                  })}
                >
                  Danh sách bài viết
                </Link>
                <Link
                  to="/admin/bai-viet/tao-bai-viet"
                  className={cx("submenu-item", {
                    active: isActive("/admin/bai-viet/tao-bai-viet"),
                  })}
                >
                  Tạo bài viết
                </Link>
              </div>
            )}
          </div>

          <div className={cx("menu-group")}>
            <div
              className={cx("menu-header", {
                active: isActive("/admin/don-hang"),
              })}
              onClick={() => toggleMenu("donhang")}
            >
              <div className={cx("menu-title")}>
                <ShoppingBag size={20} />
                <span>Đơn hàng</span>
              </div>
              <ChevronDown
                size={16}
                className={cx("chevron", { rotated: expandedMenus.donhang })}
              />
            </div>

            {expandedMenus.donhang && (
              <div className={cx("submenu")}>
                <Link
                  to="/admin/don-hang/danh-sach"
                  className={cx("submenu-item", {
                    active: isActive("/admin/don-hang/danh-sach"),
                  })}
                >
                  Danh sách đơn hàng
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className={cx("content")}>
        <header className={cx("header")}>
          <div className={cx("search-bar")}>
            <input type="text" placeholder="Tìm kiếm..." />
          </div>

          <div className={cx("user-menu")}>
            <span className={cx("admin-text")}>Admin</span>
            <div className={cx("avatar")}>
              <span>A</span>
            </div>
          </div>
        </header>

        <main className={cx("main-content")}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
