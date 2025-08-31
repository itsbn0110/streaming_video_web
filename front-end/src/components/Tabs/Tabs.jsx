import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Tabs.module.scss';

const cx = classNames.bind(styles);

const Tabs = ({ activeTab, onTabChange, children }) => {
    return (
        <div className={cx('tabs-container')}>
            <div className={cx('tabs-header')}>
                {React.Children.map(children, (child) => (
                    <button
                        className={cx('tab-button', { active: child.props.value === activeTab })}
                        onClick={() => onTabChange(child.props.value)}
                    >
                        {child.props.label}
                    </button>
                ))}
            </div>
            <div className={cx('tabs-content')}>
                {React.Children.map(children, (child) =>
                    child.props.value === activeTab ? child.props.children : null,
                )}
            </div>
        </div>
    );
};

Tabs.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
};

const Tab = ({ children }) => <>{children}</>;

Tab.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export { Tabs, Tab };
