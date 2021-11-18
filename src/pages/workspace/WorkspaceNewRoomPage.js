import React from 'react';
import {View} from 'react-native';
import _ from 'underscore';
import {withOnyx} from 'react-native-onyx';
import withFullPolicy, {fullPolicyDefaultProps, fullPolicyPropTypes} from './withFullPolicy';
import withLocalize, {withLocalizePropTypes} from '../../components/withLocalize';
import compose from '../../libs/compose';
import HeaderWithCloseButton from '../../components/HeaderWithCloseButton';
import Navigation from '../../libs/Navigation/Navigation';
import ScreenWrapper from '../../components/ScreenWrapper';
import styles from '../../styles/styles';
import TextInputWithLabel from '../../components/TextInputWithLabel';
import ExpensiPicker from '../../components/ExpensiPicker';
import ONYXKEYS from '../../ONYXKEYS';
import CONST from '../../CONST';
import Button from '../../components/Button';
import FixedFooter from '../../components/FixedFooter';
import {createPolicyRoom} from '../../libs/actions/Report';

const propTypes = {
    ...fullPolicyPropTypes,

    ...withLocalizePropTypes,
};
const defaultProps = {
    betas: [],
    ...fullPolicyDefaultProps,
};

class WorkspaceNewRoomPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roomName: '',
            policyID: '',
            visibility: CONST.REPORT.VISIBILITY.RESTRICTED,
            isLoading: false,
        };
        this.workspaceOptions = [];
        this.modifyRoomName = this.modifyRoomName.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        const workspaces = _.filter(this.props.policies, policy => policy.type === CONST.POLICY.TYPE.FREE);
        this.workspaceOptions = _.map(workspaces, policy => ({label: policy.name, key: policy.id, value: policy.id}));
    }

    onSubmit() {
        this.setState({isLoading: true});
        createPolicyRoom(this.state.policyID, this.state.roomName, this.state.visibility)
            .then(() => this.setState({isLoading: false}));
    }

    /**
     * Modifies the room name to follow our conventions:
     * - Max length 80 characters
     * - Cannot not include space or special characters, and we automatically apply an underscore for spaces
     * - Must be lowercase
     * @param {String} roomName
     *
     * @returns {String}
     */
    modifyRoomName(roomName) {
        const modifiedRoomNameWithoutHash = roomName.substr(1)
            .replace(/ /g, '_')
            .replace(/[^a-zA-Z\d_]/g, '')
            .substr(0, CONST.REPORT.MAX_ROOM_NAME_LENGTH)
            .toLowerCase();
        return `#${modifiedRoomNameWithoutHash}`;
    }

    render() {
        const shouldDisableSubmit = !this.state.roomName || !this.state.policyID;
        return (
            <ScreenWrapper>
                <HeaderWithCloseButton
                    title={this.props.translate('newRoomPage.newRoom')}
                    onCloseButtonPress={() => Navigation.dismissModal()}
                />
                <View style={[styles.flex1, styles.w100, styles.pRelative, styles.p5]}>
                    <TextInputWithLabel
                        label={this.props.translate('newRoomPage.roomName')}
                        prefixCharacter="#"
                        placeholder={this.props.translate('newRoomPage.social')}
                        containerStyles={[styles.mb5]}
                        onChangeText={roomName => this.setState({roomName: this.modifyRoomName(roomName)})}
                        value={this.state.roomName.substr(1)}
                    />
                    <ExpensiPicker
                        value={this.state.policyID}
                        label={this.props.translate('workspace.common.workspace')}
                        placeholder={{value: '', label: this.props.translate('newRoomPage.selectAWorkspace')}}
                        items={this.workspaceOptions}
                        onChange={policyID => this.setState({policyID})}
                        containerStyles={[styles.mb5]}
                    />
                    <ExpensiPicker
                        value={CONST.REPORT.VISIBILITY.RESTRICTED}
                        label={this.props.translate('newRoomPage.visibility')}
                        items={[
                            {label: 'Restricted', value: CONST.REPORT.VISIBILITY.RESTRICTED},
                            {label: 'Private', value: CONST.REPORT.VISIBILITY.PRIVATE},
                        ]}
                        onChange={visibility => this.setState({visibility})}
                    />
                </View>
                <FixedFooter>
                    <Button
                        isLoading={this.state.isLoading}
                        isDisabled={shouldDisableSubmit}
                        success
                        onPress={this.onSubmit}
                        style={[styles.w100]}
                        text={this.props.translate('newRoomPage.createRoom')}
                    />
                </FixedFooter>
            </ScreenWrapper>
        );
    }
}

WorkspaceNewRoomPage.propTypes = propTypes;
WorkspaceNewRoomPage.defaultProps = defaultProps;

export default compose(
    withFullPolicy,
    withOnyx({
        betas: {
            key: ONYXKEYS.BETAS,
        },
        policies: {
            key: ONYXKEYS.COLLECTION.POLICY,
        },
    }),
    withLocalize,
)(WorkspaceNewRoomPage);
