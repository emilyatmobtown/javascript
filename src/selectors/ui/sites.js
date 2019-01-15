/**
 * Returns the ui sites state.
 *
 * @param {Object} state Application state.
 *
 * @returns {Object} The ui sites state.
 */
export function getSitesUi( state ) {
	return state.ui.sites;
}

export const isRetrievingSites = ( state ) => {
	return state.ui.sites.retrievingSites;
};
