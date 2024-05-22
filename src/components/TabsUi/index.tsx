import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { CustomTabPanel } from "../CustomTabPanel";

type Props = {
  listTabs: {
    tab: any;
    resultTab: any;
    name: string;
  }[];
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const TabsUi = ({ listTabs }: Props) => {
  const [value, setValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setDrawerOpen(open);
    };

  const tabList = (
    <Tabs
      orientation={isMobile ? "vertical" : "horizontal"}
      value={value}
      onChange={handleChange}
      variant={isMobile ? "fullWidth" : "standard"}
      sx={{ textTransform: "capitalize" }}
    >
      {listTabs?.map((Item, index) => (
        <Tab key={index} label={Item.name} {...a11yProps(index)} />
      ))}
    </Tabs>
  );

  return (
    <Box sx={{ width: "100%" }}>
      {isMobile ? (
        <>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ ml: 2, mt: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              {tabList}
            </Box>
          </Drawer>
        </>
      ) : (
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", width: "100%" }}
          mb={2}
        >
          {tabList}
        </Box>
      )}
      {listTabs?.map((Item, index) => (
        <CustomTabPanel key={index} value={value} index={index}>
          {<Item.resultTab />}
        </CustomTabPanel>
      ))}
    </Box>
  );
};
