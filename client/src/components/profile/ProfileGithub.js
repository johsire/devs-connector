import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

import { getGithubRepos } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const ProfileGithub = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos(username)]);

  return <div />;
};

ProfileGithub.propTypes = {};

const mapStateToProps = {
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  { getGithubRepos }
)(ProfileGithub);
