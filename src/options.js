import merge from 'deepmerge';
import Handlebars from 'handlebars';
import yaml from 'js-yaml';
import marked from 'marked';
import frontMatter from 'front-matter';

var parsers = {
  content: {
    pattern: '\.(html|hbs|handlebars)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: matter.body,
        data: matter.attributes
      };
    }
  },
  markdown: {
    pattern: '\.(md|markdown)$',
    parseFn: (contents, path) => {
      var matter = frontMatter(contents);
      return {
        contents: marked(matter.body),
        data: matter.attributes
      };
    }
  },
  yaml: {
    pattern: '\.(yaml|yml)$',
    parseFn: (contents, path) => ({ contents: yaml.safeLoad(contents) })
  },
  json: {
    pattern: '\.json$',
    parseFn: (contents, path) => ({ contents: JSON.parse(contents) })
  },
  default: {
    parseFn: (contents, path) => ({ contents: contents })
  }
};

const defaults = {
  data          : 'src/data/**/*.yaml',
  handlebars    : Handlebars,
  helpers       : {},
  keys          : {
    pages       : 'pages',
    patterns    : 'patterns'
  },
  layouts       : 'src/layouts/*',
  markdownFields: ['notes'],
  pages         : 'src/pages/**/*',
  parsers       : parsers,
  partials      : 'src/partials/**/*',
  patterns      : 'src/patterns/**/*'
};

/**
 * Merge defaults into passed options
 */
function parseOptions (options = {}) {
  return merge(defaults, options);
}

export default parseOptions;
