import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Footer from "components/Footer/Footer.js";
import Parallax from "components/Parallax/Parallax.js";
import MainHeader from "components/MainComponents/MainHeader";
import MainContainer from "components/MainComponents/MainContainer";
import Blog from "./BlogComponents/Blog";
import PropsRoute from "util/PropsRoute";
// Images
import background from "assets/img/faces/cf7.jpeg";
// Styles
import styles from "assets/jss/material-kit-react/views/createPage.js";

const useStyles = makeStyles(styles);

export default function BlogPage(props) {
  const { blogPosts } = props;

  /*const fetchBlogPosts = () => {
    /!**
     * You would fetch this from the server, however we gonna use the example values from state here
     *!/
    this.blogPostsMaxUnix = dummyBlogPosts[dummyBlogPosts.length - 1].date;
    const blogPosts = dummyBlogPosts.map(blogPost => {
      let title = blogPost.title;
      title = title.toLowerCase();
      /!* Remove unwanted characters, only accept alphanumeric and space *!/
      title = title.replace(/[^A-Za-z0-9 ]/g, "");
      /!* Replace multi spaces with a single space *!/
      title = title.replace(/\s{2,}/g, " ");
      /!* Replace space with a '-' symbol *!/
      title = title.replace(/\s/g, "-");
      blogPost.url = `/blog/post/${title}`;
      blogPost.params = `?id=${blogPost.id}`;
      return blogPost;
    });
    this.setState({
      blogPosts
    });
  };*/

  const classes = useStyles();

  const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
  );

  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);

  return (
      <div>
        <MainHeader/>
        <Parallax small filter image={background} />
        <MainContainer>
          <div className={classes.section}>
            <PropsRoute
                exact
                path="/blog"
                component={Blog}
                blogPosts={blogPosts}
            />
          </div>
        </MainContainer>
        <Footer/>
      </div>
  );
}
