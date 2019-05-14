import alignLeftIcon from './icons/align-left';
import alignCenterIcon from './icons/align-center';
import alignRightIcon from './icons/align-right';
import alignJustifyIcon from './icons/align-justify';
import backgroundIcon from './icons/background';
import blockquoteIcon from './icons/blockquote';
import boldIcon from './icons/bold';
import cleanIcon from './icons/table';
import codeIcon from './icons/code';
import colorIcon from './icons/color';
import directionLeftToRightIcon from './icons/direction-ltr';
import directionRightToLeftIcon from './icons/direction-rtl';
import formulaIcon from './icons/table';
import headerIcon from './icons/table';
import header2Icon from './icons/table';
import italicIcon from './icons/italic';
import imageIcon from './icons/table';
import indentIcon from './icons/indent';
import outdentIcon from './icons/outdent';
import linkIcon from './icons/link';
import listBulletIcon from './icons/list-bullet';
import listCheckIcon from './icons/table';
import listOrderedIcon from './icons/list-ordered';
import subscriptIcon from './icons/table';
import superscriptIcon from './icons/table';
import strikeIcon from './icons/strike';
import tableIcon from './icons/table';
import underlineIcon from './icons/underline';
import videoIcon from './icons/table';

export default {
  align: {
    '': alignLeftIcon,
    center: alignCenterIcon,
    right: alignRightIcon,
    justify: alignJustifyIcon,
  },
  background: backgroundIcon,
  blockquote: blockquoteIcon,
  bold: boldIcon,
  clean: cleanIcon,
  code: codeIcon,
  'code-block': codeIcon,
  color: colorIcon,
  direction: {
    '': directionLeftToRightIcon,
    rtl: directionRightToLeftIcon,
  },
  formula: formulaIcon,
  header: {
    '1': headerIcon,
    '2': header2Icon,
  },
  italic: italicIcon,
  image: imageIcon,
  indent: {
    '+1': indentIcon,
    '-1': outdentIcon,
  },
  link: linkIcon,
  list: {
    bullet: listBulletIcon,
    check: listCheckIcon,
    ordered: listOrderedIcon,
	  'decimal': listBulletIcon,
	  'lower-alpha': listOrderedIcon,
	  'lower-greek': listOrderedIcon,
	  'lower-roman': listOrderedIcon,
	  'upper-alpha': listOrderedIcon,
	  'upper-roman': listOrderedIcon,
	  'disc': listOrderedIcon,
	  'circle': listOrderedIcon,
	  'square': listOrderedIcon,
  },
  script: {
    sub: subscriptIcon,
    super: superscriptIcon,
  },
  strike: strikeIcon,
  table: tableIcon,
  underline: underlineIcon,
  video: videoIcon,
};
