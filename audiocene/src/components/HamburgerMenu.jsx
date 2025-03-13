import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { QUERIES } from "../constants";
import { useUser } from "../features/authentication/useUser";

const HamburgerContainer = styled.div`
  background-color: var(--color-bg);
  position: relative;
  cursor: pointer;
  color: var(--color-black);
  display: none;

  @media ${QUERIES.tablet} {
    display: revert;
  }
`;

const ListIcon = styled.svg`
  width: 32px;
  height: 32px;
  fill: currentColor;
`;

const Dropdown = styled.ul`
  position: absolute;
  display: block;
  top: 100%;
  right: 0px;
  margin-top: 0.8rem;
  padding-inline-start: 0px;
  background-color: var(--color-bg);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
  z-index: 3;
  min-width: 160px;
`;

const DropdownItem = styled.li`
  font-family: var(--font-body);
  display: block;

  padding: 8px 12px;
  font-size: 1rem;
  color: var(--color-black);
  text-align: left;
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--color-light-gray);
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

function HamburgerMenu() {
  const navigate = useNavigate();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropDownRef = useRef(null);
  const triggerRef = useRef(null);
  const { user } = useUser();

  function toggleDropdown() {
    setDropDownOpen(!dropDownOpen);
  }

  const handleClickOustide = (event) => {
    if (
      dropDownRef.current &&
      !dropDownRef.current.contains(event.target) &&
      !triggerRef.current.contains(event.target)
    ) {
      setDropDownOpen(false);
    }
  };

  useEffect(() => {
    if (dropDownOpen) {
      document.addEventListener("mousedown", handleClickOustide);
    } else {
      document.removeEventListener("mousedown", handleClickOustide);
    }
    return () => document.removeEventListener("mousedown", handleClickOustide);
  }, [dropDownOpen]);

  function goToExplore() {
    navigate(`/app/explore`);
  }
  function goToAbout() {
    navigate(`/about`);
  }
  function goToLogin() {
    navigate(`/login`);
  }

  return (
    <HamburgerContainer
      ref={triggerRef}
      onClick={toggleDropdown}
      tabIndex={0}
      aria-haspopup="menu"
      aria-expanded={dropDownOpen}
      aria-label="Navigation menu"
      id="nav-menu-trigger"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggleDropdown();
        }
      }}
    >
      <ListIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
      </ListIcon>

      {dropDownOpen && (
        <Dropdown
          role="menu"
          ref={dropDownRef}
          aria-labelledby="nav-menu-trigger"
        >
          <DropdownItem
            role="menuitem"
            tabIndex={0}
            onClick={goToExplore}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToExplore();
              }
            }}
          >
            Explore
          </DropdownItem>
          <DropdownItem
            role="menuitem"
            tabIndex={0}
            onClick={goToAbout}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToAbout();
              }
            }}
          >
            About
          </DropdownItem>
          {!user && (
            <DropdownItem
              role="menuitem"
              tabIndex={0}
              onClick={goToLogin}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  goToLogin();
                }
              }}
            >
              Login
            </DropdownItem>
          )}
        </Dropdown>
      )}
    </HamburgerContainer>
  );
}

export default HamburgerMenu;
