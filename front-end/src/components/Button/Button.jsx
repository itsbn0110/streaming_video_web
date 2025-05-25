import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
const cx = classNames.bind(styles);
function Button({
    children,
    to,
    href,
    onClick,
    disabled = false,
    success = false,
    primary = false,
    outline = false,
    sky = false,
    full = false,
    sizeType = 'medium',
    secondary = false,
    rounded = false,
    leftIcon = null,
    rightIcon = null,
    className,
    ...passProps
}) {
    let Comp = 'button';
    const props = {
        onClick,
        disabled: disabled && Comp === 'button',
        ...passProps,
    };

    if (to) {
        props.to = to;
        Comp = Link;
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }

    if (disabled) {
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
        if (to) delete props.to;
        if (href) delete props.href;
    }

    const classes = cx('wrapper', sizeType, className, {
        primary,
        secondary,
        disabled,
        outline,
        success,
        sky,
        full,
        rounded,
    });

    return (
        <Comp className={classes} {...props}>
            {leftIcon && <span className={cx('icon')}> {leftIcon} </span>}
            <span className={cx('title')}>{children}</span>
            {rightIcon && <span className={cx('icon')}> {rightIcon} </span>}
        </Comp>
    );
}

Button.propTypes = {
    disabled: PropTypes.bool,
    success: PropTypes.bool,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    outline: PropTypes.bool,
    sky: PropTypes.bool,
    full: PropTypes.bool,
    rounded: PropTypes.bool,
    leftIcon: PropTypes.element,
    rightIcon: PropTypes.element,

    children: PropTypes.node.isRequired,
    to: PropTypes.string,
    href: PropTypes.string,
    onClick: PropTypes.func,
    sizeType: PropTypes.string,
    className: PropTypes.string,
};

export default Button;
