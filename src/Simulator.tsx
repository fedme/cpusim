/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './store/rootReducer'
import { RegisterEditorModal, AnyRegister } from './RegisterEditorModal'

export const Simulator = () => {
  const {
    pc, r0, r1, a, ix, sp, lightAddressBus, lightPc, lightMar, lightIr, lightMdr,
    lightDataBus, lightDecoder, lightR0, lightR1, lightAlu, lightA, lightIx, lightSp, lightIxAdder, lightSpAdder
  } = useSelector((state: RootState) => state.cpu)

  const [registerUnderEdit, setRegisterUnderEdit] = useState<AnyRegister>(null)

  return (
    <div className="relative">

      <RegisterEditorModal registerUnderEdit={registerUnderEdit} onClose={() => setRegisterUnderEdit(null)} />

      <svg
        viewBox="0 0 595.276 550" width="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="r0" transform="matrix(1.023563, 0, 0, 1, 158.740005, -467.71701)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('R0')}
        >
          <rect
            className="register"
            fill={lightR0 ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"

          />
          <text
            x="0.001" y="810.079"
          >R0
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="25" y="832.52"
          >{r0}
          </text>
        </g>
        <g
          id="r1" transform="matrix(1, 0, 0, 1, 239.528, -467.71701)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('R1')}
        >
          <rect
            className="register"
            fill={lightR1 ? '#ed1c24' : '#d2d6dc'} y="813.543"
            width="51.024" height="28.347"
          />
          <text
            x="0.001" y="810.079"
          >R1
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="25" y="832.52"
          >{r1}
          </text>
        </g>
        <g
          id="a" transform="matrix(1, 0, 0, 1, 199.134003, -332.058014)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('A')}
        >
          <rect
            className="register"
            fill={lightA ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"
          />
          <text
            x="-14.68" y="833.425"
          >A
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="25" y="832.52"
          >{a}
          </text>
        </g>
        <g
          id="pc" transform="matrix(1, 0, 0, 1, 239.528, -714.330933)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('PC')}
        >
          <rect
            className="register"
            fill={lightPc ? '#ed1c24' : '#d2d6dc'} y="813.543"
            width="51.0236" height="28.3465"
            x="0"
          />
          <text
            x="0.001" y="810.867"
          >PC
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="25" y="832.52"
          >{pc}
          </text>
        </g>
        <g id="ir" transform="matrix(1, 0, 0, 1, 425.196991, -634.960999)">
          <rect
            fill={lightIr ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"
          />
          {/* <text
          x="0.009" y="810.079"
        >IR
        </text> */}
          <text
            x="19.15" y="832.52"
          >IR
          </text>
        </g>
        <g id="alu" transform="matrix(1, 0, 0, 1, 158.740005, -371.540985)">
          <path
            fill={lightAlu ? '#ed1c24' : '#adacac'} d="M 41.261 841.891 L 95.492 841.891 L 131.789 754.221 L 77.559 754.221 L 41.261 841.891 Z"
            transform="matrix(1, 0.000494, -0.000494, 1, 0.39425, -0.042646)"
          />
          <path
            fill={lightAlu ? '#ed1c24' : '#adacac'} d="M 0 754.22 L 52.211 754.22 L 87.198 841.89 L 34.987 841.89 L 0 754.22 Z"
            transform="matrix(-1, 0, 0, -1, 87.197998, 1596.109985)"
          />
          <text
            x="52.784" y="832.08"
          >ALU
          </text>
        </g>
        <g id="mdr" transform="matrix(1, 0, 0, 1, 544.252441, -727.979736)">
          <rect
            fill={lightMdr ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"
          />
          <text
            x="9.41" y="832.52"
          >MDR
          </text>
        </g>
        <g id="mar" transform="matrix(1, 0, 0, 1, 544.25238, -760.326233)">
          <rect
            fill={lightMar ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"
          />
          <text
            x="9.7" y="832.52"
          >MAR
          </text>
        </g>
        <g
          id="ix" transform="matrix(1, 0, 0, 1, 18.4252, -776.997009)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('IX')}
        >
          <rect
            className="register"
            fill={lightIx ? '#ed1c24' : '#d2d6dc'} x="0"
            y="813.543" width="51.0236"
            height="28.3465"
          />
          <text
            x="0.012" y="810.079"
          >IX
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="25" y="832.52"
          >{ix}
          </text>
        </g>
        <g id="sp_adder" transform="translate(217,618) rotate(180)">
          <g transform="translate(16.0534,0)">
            <path fill={lightSpAdder ? '#ed1c24' : '#adacac'} d="M0 536.42 L24 536.42 L40.07 500.45 L16.08 500.45 L0 536.42 Z" />
          </g>
          <g transform="translate(40.0731,0) scale(-1,1)">
            <path fill={lightSpAdder ? '#ed1c24' : '#adacac'} d="M0 536.42 L24 536.42 L40.07 500.45 L16.08 500.45 L0 536.42 Z" />
          </g>
        </g>
        <text
          id="sp_adder_label"
          textAnchor="middle"
          x="189" y="101"
        >+
        </text>
        <g
          id="sp" transform="matrix(1, 0, 0, 1, 158.740005, -714.330994)"
          cursor="pointer"
          onClick={() => setRegisterUnderEdit('SP')}
        >
          <rect
            className="register"
            fill={lightSp ? '#ed1c24' : '#d2d6dc'} y="851.543"
            width="51.0236" height="28.3465"
            x="-27"
          />
          <text
            x="-26.298" y="847.871"
          >SP
          </text>
          <text
            textAnchor="middle"
            fontSize="12px"
            x="-2.3" y="870.52"
          >{sp}
          </text>
        </g>

        <g id="decoder" transform="matrix(0, -1, 1, 0, -456.377991, 229.910004)">
          <path
            fill={lightDecoder ? '#ed1c24' : '#adacac'} d="M0 841.89 L76.54 841.89 L68.88 756.85 L7.65 756.85 L0 841.89 Z"
          />
          <text
            fontSize="11px" x="11"
            y="803.987"
          >DECODER
          </text>
        </g>
        <g id="ix_adder" transform="matrix(0, -1, 1, 0, -711.208984, 98.807701)">
          <path
            fill={lightIxAdder ? '#ed1c24' : '#adacac'} d="M -0.004 801.92 L 26.486 801.92 L 44.236 841.89 L 17.746 841.89 L -0.004 801.92 Z"
            transform="matrix(-1, 0, 0, -1, 44.232002, 1643.809998)"
          />
          <path
            fill={lightIxAdder ? '#ed1c24' : '#adacac'} d="M 17.721 841.89 L 44.211 841.89 L 61.961 801.92 L 35.471 801.92 L 17.721 841.89 Z"
          />
        </g>
        <text
          id="ix_adder_label"
          textAnchor="middle"
          x="113" y="73"
        >+
        </text>
        <line
          stroke="gray" strokeWidth="2"
          x1="43.94" y1="64.893"
          x2="43.94" y2="539.158"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="43.546" y1="179.023"
          x2="300" y2="179.023"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="69.44880104064941" y1="48.38448357905189"
          x2="90.70870208740234" y2="48.38448357905189"
        />
        <line
          stroke={lightAddressBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          id="address_bus" x1="130.681"
          y1="66.817" x2="544.252"
          y2="66.817"
        />
        <text
          fill={lightAddressBus ? '#ed1c24' : 'gray'}
          fontSize="12px" x="354"
          y="81" id="address_bus_label"
        >ADDRESS BUS
        </text>
        <line
          stroke="gray" strokeWidth="2"
          x1="189" y1="66.81669616699219"
          x2="189" y2="82"
        />
        <line
          id="sp_sp_adder"
          stroke="gray" strokeWidth="2"
          x1="173" y1="117"
          x2="173" y2="137.5"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="204" y1="117"
          x2="204" y2="180"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="69.449" y1="85.563"
          x2="90.709" y2="85.563"
          transform="matrix(-1, 0, 0, -1, 160.15799, 171.126007)"
        />
        <line
          id="pc-address-bus-line"
          stroke={lightPc ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="265.0400390625" y1="66.81669616699219"
          x2="265.0400390625" y2="98.81159973144531"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="158" y1="165"
          x2="158" y2="179.02301025390625"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="265.0400390625" y1="127.55853271484375"
          x2="265.0400390625" y2="179.0229949951172"
        />
        <line
          id="decoder-ir-line"
          stroke={lightDecoder ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="425.1969909667969" y1="190.77310668311887"
          x2="385.51202392578125" y2="190.77310668311887"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="300.47198486328125" y1="200"
          x2="200" y2="200"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="69.449" y1="179.023"
          x2="69.449" y2="85.563"
          transform="matrix(-1, 0, 0, -1, 138.897995, 264.585999)"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="200" y1="200"
          x2="200" y2="249.65157360801194"
        />
        <line
          stroke={lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          id="data_bus" x1="127.559"
          y1="249.652" x2="526.648"
          y2="249.652"
        />
        <text
          fontSize="12px" id="data_bus_label"
          fill={lightDataBus ? '#ed1c24' : 'gray'}
          x="362.408" y="263"
        >DATA BUS
        </text>
        <line
          className="a_data_bus"
          stroke={lightA && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="43.939998626708984" y1="539.1580123901367"
          x2="224.59078968811244" y2="539.1580123901367"
        />
        <line
          className="a_data_bus"
          stroke={lightA && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="224.59078598022464" y1="509.8315124511719"
          x2="224.59078598022464" y2="539.1580200195312"
        />
        <line
          className="a_data_bus"
          stroke={lightA && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="127.55902099609375" y1="250.39699554443362"
          x2="127.55902099609375" y2="539.1580200195312"
        />
        <line
          className="a_alu" stroke="gray"
          strokeWidth="2" x1="224.59078598022464"
          y1="470.5" x2="224.59078598022464"
          y2="482"
        />
        <line
          id="r0_data_bus"
          stroke={lightR0 && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="184.25" y1="345.8260192871094"
          x2="184.25" y2="249.65158081054685"
        />
        <line
          id="r0_alu" stroke="gray"
          strokeWidth="2" x1="184.25"
          y1="384" x2="184.25"
          y2="374"
        />
        <line
          id="r1_data_bus"
          stroke={lightR1 && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="265" y1="345.8260192871094"
          x2="265" y2="249.6515808105469"
        />
        <line
          id="r1_alu" stroke="gray"
          strokeWidth="2" x1="265"
          y1="384" x2="265"
          y2="374"
        />
        <line
          stroke="gray" strokeWidth="2"
          x1="544.2520141601562" y1="98.81159973144531"
          x2="526.6477151441957" y2="98.81159973144531"
        />
        <line
          className="data-bus" stroke={lightDataBus ? '#ed1c24' : 'gray'}
          strokeWidth="2"
          x1="526.648" y1="98.812"
          x2="526.648" y2="249.652"
        />
        <line
          id="ir-data-bus-line"
          stroke={lightIr && lightDataBus ? '#ed1c24' : 'gray'} strokeWidth="2"
          x1="476.2205924987793" y1="190.77310180664062"
          x2="526.647705078125" y2="190.77310180664068"
        />
      </svg>
    </div>
  )
}
