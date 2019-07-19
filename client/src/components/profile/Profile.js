import { connect } from "react-redux";
import PropTypes from "prop-types";
import React, { Fragment, useEffect } from "react";

import { getProfileById } from "../../actions/profile";
import Spinner from "../layout/Spinner";

const Profile = ({ profile: {
  profile, loading
},
  getProfileById,
  auth,
  math
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById]);

  return <div>profile</div>
}

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { getProfileById }
)(Profile);
