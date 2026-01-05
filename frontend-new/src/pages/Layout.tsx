import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";

const Layout = () => {
  return (
    <Grid
      templateAreas={{
        base: `"nav" "main" "footer"`,
        lg: `"nav" "main" "footer"`,
      }}
      templateRows="auto 1fr auto"
      minH="100vh"
    >
      <GridItem area="nav">
        <NavBar />
      </GridItem>

      <GridItem area="main">
        <Box padding={5}>
          <Outlet />
        </Box>
      </GridItem>

      <GridItem area="footer">
        <Text>©{new Date().getFullYear()} @sruta.cn All rights reserved.</Text>
      </GridItem>
    </Grid>
  );
};

export default Layout;
