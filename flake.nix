{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };

  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems =
        with nixpkgs.lib;
        f:
        genAttrs systems.flakeExposed (
          system:
          f (
            import nixpkgs {
              inherit system;
              config.allowUnfree = true;
            }
          )
        );
    in
    {
      devShells = forAllSystems (pkgs: {
        default =
          with pkgs;
          mkShell {
            env = {
              PRISMA_QUERY_ENGINE_LIBRARY = "${prisma-engines}/lib/libquery_engine.node";
              PRISMA_QUERY_ENGINE_BINARY = lib.getExe' prisma-engines "query-engine";
              PRISMA_SCHEMA_ENGINE_BINARY = lib.getExe' prisma-engines "schema-engine";
            };
            buildInputs = [
              mongodb-ce
              nodejs
              prettier
              prisma
              openssl
            ];
            shellHook = ''
              [ -d .dev_db ] || mkdir .dev_db
              alias db="mongod --dbpath ./.dev_db"
            '';
          };
      });
    };
}
