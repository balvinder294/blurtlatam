import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import tt from 'counterpart';
import classnames from 'classnames';
import { memo } from '@blurtfoundation/blurtjs';

import BadActorList from 'app/utils/BadActorList';
import { repLog10 } from 'app/utils/ParsersAndFormatters';

const MINIMUM_REPUTATION = 15;

export class Memo extends Component {
    static propTypes = {
        text: PropTypes.string,
        username: PropTypes.string,
        fromAccount: PropTypes.string,
        // redux props
        myAccount: PropTypes.bool,
        memo_private: PropTypes.object,
        fromNegativeRepUser: PropTypes.bool.isRequired,
    };

    constructor() {
        super();
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Memo');
        this.state = {
            revealMemo: false,
        };
    }

    onRevealMemo = (e) => {
        e.preventDefault();
        this.setState({ revealMemo: true });
    };

    decodeMemo(memo_private, text) {
        try {
            return memo.decode(memo_private, text);
        } catch (e) {
            console.error('memo decryption error', text, e);
            return 'Invalid memo';
        }
    }

    render() {
        const { decodeMemo } = this;
        const {
            memo_private,
            text,
            myAccount,
            fromAccount,
            fromNegativeRepUser,
        } = this.props;
        const isEncoded = /^#/.test(text);

        const isFromBadActor = BadActorList.indexOf(fromAccount) > -1;

        if (!text || text.length < 1) return <span />;

        const classes = classnames({
            Memo: true,
            'Memo--badActor': isFromBadActor,
            'Memo--fromNegativeRepUser': fromNegativeRepUser,
            'Memo--private': memo_private,
        });

        let renderText = '';

        if (!isEncoded) {
            renderText = text;
        } else if (memo_private) {
            renderText = myAccount
                ? decodeMemo(memo_private, text)
                : tt('g.login_to_see_memo');
        }

        return <span className={classes}>{renderText}</span>;
    }
}

export default connect((state, ownProps) => {
    const currentUser = state.user.get('current');
    const myAccount =
        currentUser && ownProps.username === currentUser.get('username');
    const memo_private =
        myAccount && currentUser
            ? currentUser.getIn(['private_keys', 'memo_private'])
            : null;
    const fromNegativeRepUser =
        repLog10(
            state.global.getIn(['accounts', ownProps.fromAccount, 'reputation'])
        ) < MINIMUM_REPUTATION;
    return { ...ownProps, memo_private, myAccount, fromNegativeRepUser };
})(Memo);
