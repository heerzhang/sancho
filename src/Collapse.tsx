/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/core";
import * as React from "react";
import { animated, useSpring } from "react-spring";
import PropTypes from "prop-types";
import { useMeasure } from "./Hooks/use-measure";
import { useUid } from "./Hooks/use-uid";
import { useTheme } from "./Theme/Providers";

export function useCollapse(defaultShow: boolean = false, press:boolean=false) {
  const [show, setShow] = React.useState(defaultShow);
  const id = useUid();

  function onClick() {
    setShow(!show);
  }

  return {
    show,
    setShow,
    id,
    buttonProps: {
      onClick : press? undefined : onClick,
      onPress : press? onClick : undefined,
      "aria-controls": id,
      "aria-expanded": show ? true : false
    },
    collapseProps: {
      id,
      show
    }
  };
}

interface AnimateCollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A unique id required for accessibility purposes. */
  id: string;
  /** Controls whether the children should be visible */
  show: boolean;
  /** Any element that you want to reveal */
  children: React.ReactNode;
  divStyle?: SerializedStyles;
}

/**
 * Hide and reveal content with an animation. Supports dynamic
 * heights.
 */
export const AnimateCollapse: React.FunctionComponent<AnimateCollapseProps> = ({
                                                                   children,
                                                                   id,
                                                                   show,
                                                                   divStyle,
                                                                   ...other
                                                                 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { bounds } = useMeasure(ref);
  const prevShow = usePrevious(show);
  //高度 动画副作用，导致计算问题？ 旧的to: { height: show ? bounds.height : 0 },
  //这个height实际是一个对象的。  const { animationObj } = useSpring ；注意两个height不是一个东西。
  //这里useSpring({）的参数 实际是初始化用的，后面输出的对象height.value实际是动画编制的起始数值，而不是目标数值。

  //[问题！] 这里的useSpring（）没有处理内部DIV高度变化的副作用；打印机场景div高度会缩放调整，应该被缩小的<animated.div却没有被缩小。
  const { height } = useSpring({
    from: { height: 0 },
    to: { height: show ? bounds.height : 0 },
    immediate: prevShow !== null && prevShow === show
  }) as any;
  //实际打印预览会捕获3次的render这里，Collapse-捕获height=，前面2次纸张缩放调整，缩小了，div就会变矮化，后面第三次却是屏幕的。
  //只好先预留大一点的高度。 有待改进。动画可能切割打印。
  const dynamicHeight = (bounds.height > (height&&height.value)) ? (bounds.height): (height&&height.value)>0? (height&&height.value) : undefined;

  return (
        <div  css={[
          {
            height: show? dynamicHeight : 0,
            ["@media not print"]: {
              display: show ?  undefined : 'none',
            },
            ["@media print"]: {
              overflow: "hidden",
            },
          },
        ]}
        >
          <animated.div
            id={id}
            style={{ height } as any}
            css={{
              willChange: "height, opacity",
            }}
            {...other}
          >

            <div ref={ref}  css={divStyle} >{children}</div>

          </animated.div>
        </div>
  );
};

interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  /** A unique id required for accessibility purposes. */
  id: string;
  /** Controls whether the children should be visible */
  show: boolean;
  /** Any element that you want to reveal */
  children: React.ReactNode;
  divStyle?: SerializedStyles;
  noAnimated?: boolean;
}

/**
 * Hide and reveal content with an animation. Supports dynamic heights.
 * 针对两种方式取舍display:'none', 和 show&& (<div>{children}</div>)比较，还是逻辑隐藏更好，若遇到耗时子组件时表现更好。
 */
export const Collapse: React.FunctionComponent<CollapseProps> = ({
  children,
  id,
  show,
  divStyle,
  noAnimated =false,
  ...other
}) => {

  return (
    <React.Fragment>
    {
      noAnimated? (
        <div
          id={id}
          aria-hidden={!show}
          css={{
            display: show ?  undefined : 'none',
            overflow: "hidden",
          }}
          {...other}
          >

          { show&& (
            <div  css={divStyle}> {children} </div>
          ) }

        </div>
        )
        :
        (
          <AnimateCollapse  id={id}  show={show}  divStyle={divStyle}>
            {children}
          </AnimateCollapse>
        )
    }
    </React.Fragment>
  );
};

Collapse.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired
};

export function usePrevious<T>(value: T) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
