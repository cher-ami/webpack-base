import "./BlogPage.less";
import React, { forwardRef, useRef } from "react";
import { Route, Router } from "wouter";

interface IProps {
  classNames?: string[];
}

const component: string = "BlogPage";

function BlogPage(props: IProps) {
  return <div className={component}>{component}</div>;
}

export default BlogPage;
