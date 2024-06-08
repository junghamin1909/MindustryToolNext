declare global {
  type QueryKey = (
    | 'schematics'
    | 'maps'
    | 'posts'
    | 'schematic-uploads'
    | 'map-uploads'
    | 'post-uploads'
    | 'total-schematic-uploads'
    | 'total-map-uploads'
    | 'total-post-uploads'
    | 'servers'
    | 'logs'
    | 'user-schematics'
    | 'user-maps'
    | 'user-posts'
    | 'me-schematics'
    | 'me-maps'
    | 'me-posts'
    | 'internal-server-files'
  ) &
    any;

  type TQueryKey = QueryKey;
}
