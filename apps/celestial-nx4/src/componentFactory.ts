import Hero from "./components/Hero/Hero";
import LinkList from "./components/LinkList/LinkList";
import { componentFactoryWithUniformPersonalizer } from "./componentFactoryWithUniformPersonalizer"
import { ComponentType } from "react"

const components = new Map<string, ComponentType>();
components.set("Hero", Hero);
components.set("LinkList", LinkList);

export const componentFactory = componentFactoryWithUniformPersonalizer(components)
