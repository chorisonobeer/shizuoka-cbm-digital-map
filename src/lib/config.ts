import { parse } from 'yaml';
import configData from '../../config.yml?raw';

const config: Record<string, string> = parse(configData);

export default config;
