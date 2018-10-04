import React from "react";
import { injectIntl, defineMessages, FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import { PurpleLink, ErrorMessage, WarningMessage, MessageIcon } from "../components/MessageBoxes";
import exclamationTriangle from "../icons/exclamation-triangle.svg";
import exclamationCircle from "../icons/exclamation-circle.svg";
import errorMessageLookUp from "../errors/ErrorMessageLookup.json";

const messages = defineMessages( {
	contactSupportLink: {
		id: "contact.support.link",
		defaultMessage: "please contact support",
	},
} );

/**
 * This class can render error messages in our custom style. It outputs the styled error message if its errorMessage prop is not empty.
 * Else, it renders null.
 *
 * @returns {ReactElement} The rendered ErrorMessage component.
 */
class ErrorDisplay extends React.Component {
	/**
	 * Sets the ErrorMessage object.
	 * The parameter showIcon is set to true by default, and will render a warning triangle with adjusted padding-left.
	 * The constructor sets iconPadding to true, because by default the icon is shown. This requires altered padding-left.
	 *
	 * @param {Object} props The props passed to the component.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );
		this.iconPadding = true;
		this.messageType = "";
		this.recodedMessage = "";
	}

	/**
	 * Checks the errormessage for placeholders, replaces them with desired content. Outputs an object that can be used by formatMessage().
	 *
	 * @param {string} errorMessage The string to check for placeholders.
	 * @param {Object} error The error object.
	 *
	 * @returns {Object} An object with a defaultMessage and values, which can be used by FormattedMessage.
	 */
	handlePlaceholders( errorMessage, error ) {
		let defaultMessage = "{ errorMessage }";
		let values = { errorMessage };

		// In the case of a [customer_support_link] placeholder, replace with an e-mail link to support. Will eventually link to Knowledge base.
		if ( errorMessage.indexOf( "[customer_support_link]" ) > -1 ) {
			errorMessage = errorMessage.replace( "[customer_support_link]", "" );
			const contactLink = (
				<PurpleLink href="mailto:support@yoast.com">
					<FormattedMessage id={ messages.contactSupportLink.id } defaultMessage={ messages.contactSupportLink.defaultMessage } />
				</PurpleLink> );
			defaultMessage = "{ errorMessage }{ contactLink }.";
			values = { errorMessage, contactLink };
		}

		// In the case of an [error_context] placeholder, replace with the contents of the context field present in certain errors.
		if ( errorMessage.indexOf( "[error_context]" ) > -1 ) {
			errorMessage = errorMessage.replace( "[error_context]", `${ error.context.toLowerCase() }` );
			values = { errorMessage };
		}

		if ( errorMessage.indexOf( "[invalid_param]" ) > -1 ) {
			errorMessage = errorMessage.replace( "[invalid_param]", `${ Object.keys( error.data.params ) }` );
			values = { errorMessage };
		}

		return ( { defaultMessage, values } );
	}

	/**
	 * Formats an object containing a defaultMessage and values into a FormattedMessage component.
	 *
	 * @param {Object} messageFormatObject An object containing a defaultMessage and values that replace defaultMessage sections.
	 *
	 * @returns {ReactElement} A FormattedMessage component that contains the formatted error message.
	 */
	toFormattedMessage( messageFormatObject ) {
		return (
			<FormattedMessage
				id="sites.addSite.error"
				defaultMessage={ messageFormatObject.defaultMessage }
				values={ messageFormatObject.values }
			/>
		);
	}

	/**
	 * Returns the exclamationTriangle Icon in case of a warning and an exclamationCircle in case of an error.
	 *
	 * @param {Boolean} showIcon Whether to show the warning triangle icon (true) or not (false). Default = true.
	 *
	 * @returns {ReactElement} Returns null in case the input is set to false, and the warning triangle icon if true.
	 */
	renderIcon( showIcon ) {
		if ( showIcon !== true ) {
			this.iconPadding = false;

			return null;
		}

		const icon = this.messageType === "warning" ? exclamationTriangle : exclamationCircle;
		return (
			<MessageIcon iconSource={ icon } />
		);
	}

	/**
	 * Errors exist in a couple of varieties. This function sets some fields on all of these errors,
	 * such that the rest of this class can handle all varieties.
	 *
	 * @param {Object} error The error object received.
	 *
	 * @returns {Object} An error object that this class can handle.
	 */
	unifyErrorStructure( error ) {
		// If the error is a validation error on the server side, it will have a field called code.
		if ( error.hasOwnProperty( "code" ) ) {
			return error;
		}
		// If the error is a validation warning generated by the front-end, it will have a field called validator.
		if ( error.hasOwnProperty( "validator" ) ) {
			error.message = error.options.message;
			return error;
		}
		// If the error is a server-side error sent from the API, it will have a field error, containing a useful error object.
		if ( error.hasOwnProperty( "error" ) && typeof error.error === "object" ) {
			return error.error;
		}
		// If the error originates from the LearnDash API, its name will start with learndash. It has no error.code.
		if ( error.hasOwnProperty( "name" ) && error.name.startsWith( "learndash" ) ) {
			error.code = error.name;
			return error;
		}
		error.code = "GENERAL_SUPPORT_ERROR";
		return error;
	}

	/**
	 * This function sets this.recodedMessage according to the error type and information in the lookup table.
	 *
	 * @param {Object} error The error object.
	 *
	 * @returns {void}
	 */
	recodeMessage( error ) {
		if ( error.code ) {
			this.recodedMessage = error.code in errorMessageLookUp ? errorMessageLookUp[ error.code ].message : errorMessageLookUp.GENERAL_SUPPORT_ERROR.message;
		} else if ( error.validator ) {
			this.recodedMessage = error.message;
		}
	}

	/**
	 * This function sets this.messageType according to the error type and information in the lookup table.
	 *
	 * @param {Object} error The error object.
	 *
	 * @returns {void}
	 */
	setMessageType( error ) {
		if ( error.code ) {
			this.messageType = error.code in errorMessageLookUp ? errorMessageLookUp[ error.code ].type : errorMessageLookUp.GENERAL_SUPPORT_ERROR.type;
		} else if ( error.validator ) {
			this.messageType = "warning";
		}
	}

	/**
	 * Sets the error message to be rendered, or null.
	 *
	 * @param {object} error The message to render.*
	 *
	 * @returns {ReactElement} The to be rendered JSX element.
	 */
	setMessage( error ) {
		if ( error === null ) {
			return null;
		}
		error = this.unifyErrorStructure( error );
		this.recodeMessage( error );
		this.setMessageType( error );

		const messageFormatObject = this.handlePlaceholders( this.recodedMessage, error );
		const finalMessage = this.toFormattedMessage( messageFormatObject );
		const errorIcon = this.renderIcon( this.props.showIcon );

		const MessageBox = ( this.messageType === "warning" ) ? WarningMessage : ErrorMessage;
		return (
			<MessageBox role="alert" iconPadding={ this.iconPadding } className={ this.props.className }>
				{ errorIcon }
				{ finalMessage }
			</MessageBox>
		);
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		return (
			this.setMessage( this.props.error )
		);
	}
}

ErrorDisplay.propTypes = {
	error: PropTypes.object,
	type: PropTypes.string,
	showIcon: PropTypes.bool,
	className: PropTypes.string,
};

ErrorDisplay.defaultProps = {
	error: null,
	showIcon: true,
};

export default injectIntl( ErrorDisplay );
