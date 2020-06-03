import React, { useRef } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/theme-github'
import { useDebouncedCallback } from 'use-debounce'
import useResizeObserver from 'use-resize-observer'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store/rootReducer'
import { setCode } from './store/cpuSlice'

export const CodeEditor = () => {
  const ref = useRef(null)
  const { width = 1 } = useResizeObserver({ ref })
  const dispatch = useDispatch()
  const { code } = useSelector((state: RootState) => state.cpu)
  const onCodeChange = (newValue: string) => dispatch(setCode(newValue))
  const [onCodeChangeDebounced] = useDebouncedCallback(onCodeChange, 500)

  return (
    <div className="w-full h-full" ref={ref}>
      <AceEditor
        mode="java"
        theme="github"
        value={code}
        onChange={onCodeChangeDebounced}
        width={width.toString()}
      />
    </div>
  )
}

// export class CustomHighlightRules extends window.ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules {
//   constructor() {
//     super()
//     this.$rules = {
//       start: [{
//         token: 'comment',
//         regex: '#.*$'
//       }, {
//         token: 'string',
//         regex: '".*?"'
//       }]
//     }
//   }
// }
