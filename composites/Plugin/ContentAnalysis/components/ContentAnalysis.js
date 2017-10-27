import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import PropTypes from "prop-types";

import { injectIntl, intlShape, defineMessages, FormattedMessage } from "react-intl";
import { makeOutboundLink } from "../../../../utils/makeOutboundLink";
import AnalysisResult from "../components/AnalysisResult.js";
import AnalysisCollapsible from "../components/AnalysisCollapsible.js";

export const ContentAnalysisContainer = styled.div`
	min-height: 700px;
	width: 100%;
	background-color: white;
	max-width: 800px;
	margin: 0 auto;
`;

const LanguageNotice = styled.p`
	min-height: 24px;
	padding-top: 8px;
	margin-left: 36px;
`;

const ChangeLanguageLink = makeOutboundLink( styled.a`
	color: ${ colors.$color_blue };
	margin-left: 4px;
` );

const messages = defineMessages( {
	languageNoticeLink: {
		id: "content-analysis.language-notice-link",
		defaultMessage:	"Change language",
	},
	errorsHeader: {
		id: "content-analysis.errors",
		defaultMessage: "Errors",
	},
	problemsHeader: {
		id: "content-analysis.problems",
		defaultMessage: "Problems",
	},
	improvementsHeader: {
		id: "content-analysis.improvements",
		defaultMessage: "Improvements",
	},
	considerationsHeader: {
		id: "content-analysis.considerations",
		defaultMessage: "Considerations",
	},
	goodHeader: {
		id: "content-analysis.good",
		defaultMessage: "Good",
	},
	highlight: {
		id: "content-analysis.highlight",
		defaultMessage: "Highlight this result in the text",
	},
} );

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
class ContentAnalysis extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			checked: "",
		};
	}

	/**
	 * Handles button clicks. Makes sure no more than one button can be active at the same time.
	 *
	 * @param {string} id The button id.
	 *
	 * @returns {void}
	 */
	handleClick( id ) {
		if ( id === this.state.checked ) {
			this.setState( {
				checked: "",
			} );
			return;
		}

		this.setState( {
			checked: id,
		} );
	}

	/**
	 * Gets the color for the bullet, based on the rating.
	 *
	 * @param {string} rating The rating of the result.
	 *
	 * @returns {string} The color for the bullet.
	 */
	getColor( rating ) {
		switch ( rating ) {
			case "good":
				return colors.$color_good;
			case "OK":
				return colors.$color_ok;
			case "bad":
				return colors.$color_bad;
			default:
				return colors.$color_score_icon;
		}
	}

	/**
	 * Returns an AnalysisResult component for each result.
	 *
	 * @param {array} results The analysis results.
	 *
	 * @returns {array} A list of AnalysisResult components.
	 */
	getResults( results ) {
		return results.map( ( result ) => {
			let color = this.getColor( result.rating );
			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				ariaLabel={ this.props.intl.formatMessage( messages.highlight ) }
				pressed={ result.id === this.state.checked }
				buttonId={ result.id }
				onButtonClick={ this.handleClick.bind( this, result.id ) }
			/>;
		} );
	}

	/**
	 * Renders a ContentAnalysis component.
	 *
	 * @returns {ReactElement} The rendered ContentAnalysis component.
	 */
	render() {
		let problemsResults = this.props.problemsResults;
		let improvementsResults = this.props.improvementsResults;
		let goodResults = this.props.goodResults;
		let considerationsResults = this.props.considerationsResults;
		let errorsResults = this.props.errorsResults;
		let isOnReadabilityTab = this.props.isOnReadabilityTab;

		// Analysis collapsibles are only rendered when there is at least one analysis result for that category present.
		return (
			<ContentAnalysisContainer>
				{ isOnReadabilityTab && <LanguageNotice>
					<FormattedMessage
						id="content-analysis.language-notice"
						defaultMessage="Your site language is set to {language}."
						values={ { language: <strong>{ this.props.language }</strong> } } />
					<ChangeLanguageLink href={ this.props.changeLanguageLink }>
						{ this.props.intl.formatMessage( messages.languageNoticeLink ) }
					</ChangeLanguageLink>
				</LanguageNotice> }
				{ errorsResults.length > 0 &&
				<AnalysisCollapsible
					hasHeading={ true }
					headingLevel={ 2 }
					initialIsOpen={ true }
					title={ this.props.intl.formatMessage( messages.errorsHeader ) }
				>
					{ this.getResults( errorsResults ) }
				</AnalysisCollapsible> }
				{ problemsResults.length > 0 &&
					<AnalysisCollapsible
						hasHeading={ true }
						headingLevel={ 2 }
						initialIsOpen={ true }
						title={ this.props.intl.formatMessage( messages.problemsHeader ) }
					>
						{ this.getResults( problemsResults ) }
					</AnalysisCollapsible> }
				{ improvementsResults.length > 0 &&
					<AnalysisCollapsible
						hasHeading={ true }
						headingLevel={ 2 }
						title={ this.props.intl.formatMessage( messages.improvementsHeader ) }
					>
						{ this.getResults( improvementsResults ) }
					</AnalysisCollapsible> }
				{ considerationsResults.length > 0 &&
					<AnalysisCollapsible
						hasHeading={ true }
						headingLevel={ 2 }
						title={ this.props.intl.formatMessage( messages.considerationsHeader ) }
					>
						{ this.getResults( considerationsResults ) }
					</AnalysisCollapsible> }
				{ goodResults.length > 0 &&
					<AnalysisCollapsible
						hasHeading={ true }
						headingLevel={ 2 }
						title={this.props.intl.formatMessage( messages.goodHeader ) }
					>
						{ this.getResults( goodResults ) }
					</AnalysisCollapsible> }
			</ContentAnalysisContainer>
		);
	}
}

ContentAnalysis.propTypes = {
	problemsResults: PropTypes.array,
	improvementsResults: PropTypes.array,
	goodResults: PropTypes.array,
	considerationsResults: PropTypes.array,
	errorsResults: PropTypes.array,
	changeLanguageLink: PropTypes.string.isRequired,
	language: PropTypes.string.isRequired,
	isOnReadabilityTab: PropTypes.bool,
	intl: intlShape.isRequired,
};

ContentAnalysis.defaultProps = {
	problemsResults: [],
	improvementsResults: [],
	goodResults: [],
	considerationsResults: [],
	errorsResults: [],
	isOnReadabilityTab: false,
};

export default injectIntl( ContentAnalysis );
