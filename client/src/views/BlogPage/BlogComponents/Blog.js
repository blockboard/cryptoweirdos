import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Grid, Box, isWidthUp, withWidth, withStyles } from "@material-ui/core";
import BlogCard from "./BlogCard";

const styles = theme => ({
  blogContentWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    maxWidth: 1280,
    position: "center",
    [theme.breakpoints.up("xs")]: {
      width: "100%",
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "50%",
    }
  },
  wrapper: {
    minHeight: "60vh"
  },
  noDecoration: {
    textDecoration: "none !important"
  }
});

class Blog extends PureComponent {
  componentDidMount() {
    const { selectBlog } = this.props;
    selectBlog();
  }

  getVerticalBlogposts = () => {
    const { width, blogPosts } = this.props;
    const gridRows = [[], [], []];
    let rows;
    let xs;
    if (isWidthUp("md", width)) {
      rows = 1;
      xs = 12;
    } else if (isWidthUp("sm", width)) {
      rows = 1;
      xs = 6;
    } else {
      rows = 1;
      xs = 12;
    }
    blogPosts.forEach((blogPost, index) => {
      gridRows[index % rows].push(
        <Grid key={blogPost.id} item xs={12}>
          <Box mb={3}>
            <BlogCard
              src={blogPost.imageSrc}
              title={blogPost.title}
              snippet={blogPost.snippet}
              date={blogPost.date}
              url={blogPost.url}
            />
          </Box>
        </Grid>
      );
    });
    return gridRows.map((element, index) => (
      <Grid key={index} item xs={xs}>
        {element}
      </Grid>
    ));
  };

  render() {
    const { classes } = this.props;
    return (
      <Box
        display="flex"
        justifyContent="center"
        className={classNames(classes.wrapper, "lg-p-top")}
      >
        <div className={classes.blogContentWrapper}>
          <Grid container spacing={3}>
            {this.getVerticalBlogposts()}
          </Grid>
        </div>
      </Box>
    );
  }
}

Blog.propTypes = {
  selectBlog: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  width: PropTypes.string.isRequired,
  blogposts: PropTypes.arrayOf(PropTypes.object)
};

export default withWidth()(withStyles(styles, { withTheme: true })(Blog));
