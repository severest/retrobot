import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

global._ = require('lodash');

configure({ adapter: new Adapter() });
