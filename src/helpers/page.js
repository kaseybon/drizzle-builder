import R from 'ramda';
import {relative as relativePath} from 'path';
import {splitPath} from '../utils/object';
import {resourcePath} from '../utils/shared';
import {sortByProp} from '../utils/list';

export default function register (options) {
  const Handlebars = options.handlebars;

  Handlebars.registerHelper('pages', (path, context) => {
    const builder = context.data.root.drizzle;
    const pathBits = splitPath(path);
    const subset = R.path(pathBits, builder.pages);
    const isPage = R.propEq('resourceType', 'page');
    const pickProps = R.pick(['id', 'url', 'data', 'key']);
    const options = context.hash;

    // TODO: https://github.com/cloudfour/drizzle/issues/43
    const pageDest = relativePath(
      builder.options.dest.root,
      builder.options.dest.pages
    );

    let results = [];

    // Fill results with objects refined from the page subset
    for (const key in subset) {
      const page = subset[key];
      if (isPage(page)) {
        page.url = resourcePath(page.id, pageDest);
        page.key = key;
        results.push(pickProps(page));
      }
    }

    // Apply filtering to results
    if (options.ignore) {
      results = results.filter(page => page.key !== options.ignore);
    }

    // Apply sorting to results
    if (options.sortby) {
      results = sortByProp(['data', options.sortby], results);
    }

    return results;
  });

  return Handlebars;
}
