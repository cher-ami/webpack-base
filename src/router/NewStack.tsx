import React, { useEffect, useRef, useState } from "react";
import { Route, useLocation } from "wouter";
import HomePage from "../pages/homePage/HomePage";
import BlogPage from "../pages/blogPage/BlogPage";
import ArticlePage from "../pages/articlePage/ArticlePage";
import { useDidUpdate } from "../hooks/useDidUpdate";
import { getRoute, Routes } from "./Routes";

function NewStack() {
  // location
  const [location, setLocation] = useLocation();

  // récupérer oldRoute
  const [oldLocation, setOldLocation] = useState("");

  // sav old location
  const savOldLocation = useRef(location);

  /**
   * Store state in oldState
   */
  useEffect(() => {
    // // here we have the old location
    // console.log("old location", savOldLocation);
    //
    // // set old location
    // setOldLocation(savOldLocation.current);
    //
    // // sav new old location
    // savOldLocation.current = location;
  }, [location]);

  // counter
  const [count, setCount] = useState(0);

  /**
   * Increment counter
   */
  useEffect(() => setCount(count + 1), [location]);

  // old component
  //const OldComponent: any = getCurrentRouteComponent(Routes, oldLocation);

  //
  return (
    <div>
      {/*{OldComponent && <OldComponent />}*/}

      <Route path={"/"}>
        <HomePage />
      </Route>
      <Route path={"/blog"}>
        <BlogPage />
      </Route>
      <Route path={"/blog/:id"}>
        <ArticlePage />
      </Route>
    </div>
  );
}

export default NewStack;
