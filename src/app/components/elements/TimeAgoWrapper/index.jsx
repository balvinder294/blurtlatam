/* eslint react/prop-types: 0 */
import { Component } from 'react';
import { FormattedRelative, injectIntl } from 'react-intl';
import Tooltip from 'app/components/elements/Tooltip';

class TimeAgoWrapper extends Component {
    render() {
        let { date, className } = this.props;
        if (date && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d$/.test(date)) {
            date = date + 'Z'; // Firefox really wants this Z (Zulu)
        }
        const dt = new Date(date);
        const date_time = `${this.props.intl.formatDate(
            dt
        )} ${this.props.intl.formatTime(dt)}`;
        return (
            <Tooltip t={date_time} className={className}>
                <FormattedRelative {...this.props} value={date} />
            </Tooltip>
        );
    }
}

export default injectIntl(TimeAgoWrapper);
