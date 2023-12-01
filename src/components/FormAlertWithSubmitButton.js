import PropTypes from 'prop-types';
import React from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import useThemeStyles from '@styles/useThemeStyles';
import Button from './Button';
import FormAlertWrapper from './FormAlertWrapper';
import translatableTextPropTypes from './translatableTextPropTypes';

const propTypes = {
    /** Text for the button */
    buttonText: PropTypes.string.isRequired,

    /** Styles for container element */
    // eslint-disable-next-line react/forbid-prop-types
    containerStyles: PropTypes.arrayOf(PropTypes.object),

    /** Whether to show the alert text */
    isAlertVisible: PropTypes.bool.isRequired,

    /** Whether the button is disabled */
    isDisabled: PropTypes.bool,

    /** Is the button in a loading state */
    isLoading: PropTypes.bool,

    /** Whether message is in html format */
    isMessageHtml: PropTypes.bool,

    /** Error message to display above button */
    message: translatableTextPropTypes,

    /** Callback fired when the "fix the errors" link is pressed */
    onFixTheErrorsLinkPressed: PropTypes.func,

    /** Submit function */
    onSubmit: PropTypes.func.isRequired,

    /** Should the button be enabled when offline */
    enabledWhenOffline: PropTypes.bool,

    /** Disable press on enter for submit button */
    disablePressOnEnter: PropTypes.bool,

    /** Whether the form submit action is dangerous */
    isSubmitActionDangerous: PropTypes.bool,

    /** Custom content to display in the footer after submit button */
    footerContent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

    /** Styles for the button */
    // eslint-disable-next-line react/forbid-prop-types
    buttonStyles: PropTypes.arrayOf(PropTypes.object),
};

const defaultProps = {
    message: '',
    isDisabled: false,
    isMessageHtml: false,
    containerStyles: [],
    isLoading: false,
    onFixTheErrorsLinkPressed: () => {},
    enabledWhenOffline: false,
    disablePressOnEnter: false,
    isSubmitActionDangerous: false,
    footerContent: null,
    buttonStyles: [],
};

function FormAlertWithSubmitButton(props) {
    const styles = useThemeStyles();
    const buttonStyles = [_.isEmpty(props.footerContent) ? {} : styles.mb3, ...props.buttonStyles];

    return (
        <FormAlertWrapper
            containerStyles={[styles.mh5, styles.mb5, styles.justifyContentEnd, ...props.containerStyles]}
            isAlertVisible={props.isAlertVisible}
            isMessageHtml={props.isMessageHtml}
            message={props.message}
            onFixTheErrorsLinkPressed={props.onFixTheErrorsLinkPressed}
        >
            {(isOffline) => (
                <View>
                    {isOffline && !props.enabledWhenOffline ? (
                        <Button
                            success
                            isDisabled
                            text={props.buttonText}
                            style={buttonStyles}
                            danger={props.isSubmitActionDangerous}
                        />
                    ) : (
                        <Button
                            success
                            pressOnEnter={!props.disablePressOnEnter}
                            text={props.buttonText}
                            style={buttonStyles}
                            onPress={props.onSubmit}
                            isDisabled={props.isDisabled}
                            isLoading={props.isLoading}
                            danger={props.isSubmitActionDangerous}
                        />
                    )}
                    {props.footerContent}
                </View>
            )}
        </FormAlertWrapper>
    );
}

FormAlertWithSubmitButton.propTypes = propTypes;
FormAlertWithSubmitButton.defaultProps = defaultProps;
FormAlertWithSubmitButton.displayName = 'FormAlertWithSubmitButton';

export default FormAlertWithSubmitButton;
