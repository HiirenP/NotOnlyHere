import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import StoryPage from "../pages/story/page";
import StoriesIndex from "../pages/stories/page";
import MissionPage from "../pages/mission/page";
import ImpactPage from "../pages/impact/page";
import About from "../pages/about/page";
import Features from "../pages/features/page";
import HowItWorks from "../pages/how-it-works/page";
import HowWeWorkPage from "../pages/how-we-work/page";
import Circles from "../pages/circles/page";
import AiSupport from "../pages/ai-support/page";
import Services from "../pages/services/page";
import Blog from "../pages/blog/page";
import BlogPost from "../pages/blog/post/page";
import Support from "../pages/support/page";
import Contact from "../pages/contact/page";
import Login from "../pages/login/page";
import Register from "../pages/register/page";
import Faq from "../pages/faq/page";
import Guidelines from "../pages/guidelines/page";
import Privacy from "../pages/privacy/page";
import Terms from "../pages/terms/page";
import Pricing from "../pages/pricing/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/stories",
    element: <StoriesIndex />,
  },
  {
    path: "/story/:slug",
    element: <StoryPage />,
  },
  {
    path: "/mission",
    element: <MissionPage />,
  },
  {
    path: "/impact",
    element: <ImpactPage />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/features",
    element: <Features />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/how-we-work",
    element: <HowWeWorkPage />,
  },
  {
    path: "/circles",
    element: <Circles />,
  },
  {
    path: "/ai-support",
    element: <AiSupport />,
  },
  {
    path: "/services",
    element: <Services />,
  },
  {
    path: "/blog",
    element: <Blog />,
  },
  {
    path: "/blog/post",
    element: <BlogPost />,
  },
  {
    path: "/support",
    element: <Support />,
  },
  {
    path: "/download",
    element: <Navigate to="/register" replace />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/faq",
    element: <Faq />,
  },
  {
    path: "/guidelines",
    element: <Guidelines />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;