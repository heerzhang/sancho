/** @jsx jsx */
import { jsx, SerializedStyles } from "@emotion/react";
import * as React from "react";
import { animated, useSpring } from "react-spring";
import PropTypes from "prop-types";
import { useMeasure } from "./Hooks/use-measure";
import { useUid } from "./Hooks/use-uid";
import { useTheme } from "./Theme/Providers";
import { Text } from "./Text";

export function useCollapse(defaultShow: boolean = false, press:boolean=false) {
  const [show, setShow] = React.useState(defaultShow);
  const id = useUid();

  function onClick() {
    setShow(!show);
  }

  React.useEffect(() => {
    setShow(defaultShow);
  }, [defaultShow] );

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
          <LazyToggleViewer show={show} css={divStyle}>
           {children}
          </LazyToggleViewer>
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

/* 比较优缺点：
{ show  && toLoad }   逻辑&&方式加载快，恢复显示每次都得再render！适合展示概率不算大的内容。
 display:'none' ,	 组件加载时慢，后面恢复显示就很快了，不会再render了！较适合大概率会呈现的内容。
visibility:'hidden'   切换不浪费时间，但界面空间上被占用，适用性不好。
*/
interface LazyToggleViewerProps {
  show: boolean;
  children?: React.ReactNode;
}
//切换隐藏显示得内容： 初始化show=false情形=启动懒加载。是取长补短的模式。
//若放在逻辑&&方式{show&&()}的组件下或路由后再进入呈现的子组件，就失去效果，父组件被要求重新渲染！就等于树的根节点决定枝条节点命运。
//这样来看该组件放在层级太低的组件位置，可能没有意义，要搞就得放在较高组件层次的位置上。路由RouterLink本身就是逻辑&&方式的。
export const LazyToggleViewer: React.FunctionComponent<LazyToggleViewerProps> = ({
   show,
   children,
   ...other
 }) => {
  const [mounted, setMounted] = React.useState(false);
  if(!mounted){
    if(show)  setMounted(true);
    //这里反正底下组件还未加载，可以这么做
    return  null;
  }
  return (
    <div
      css={{display: show ? undefined : 'none'}}
      {...other}
    >
      {children}
    </div>
  );
};

LazyToggleViewer.propTypes = {
  children: PropTypes.node,
  show: PropTypes.bool.isRequired
};

interface TestRenderLoadProps {
  loop?: number;
  num?: number;
  txt?: string;
}
//性能测试专用的。
export const TestRenderLoad: React.FunctionComponent<TestRenderLoadProps> = ({ loop=3000, num=4, txt='针对渲染次数做优化，性能测试专用的！', ...other   }) => {
  console.log(txt);
  return (
    <div  css={{display: 'none'}}
       {...other}
    >
      {
        Array.from(new Array(loop)).map( (a,i)=>
          {
            return <Text key={i}>
              {
                Array.from(new Array(num)).map( (a,i)=>
                  { return <Text key={i}>{txt}</Text>}
                )
              }
            </Text>
          }
        )
      }
    </div>
  );
};

