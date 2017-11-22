after 'bundler:install', :build_js do
  on roles(:web) do |host|
    within release_path do
      info "Host #{host} installing packages"
      execute :yarn, "install", "--pure-lockfile"
      info "Host #{host} compiling JS"
      execute :yarn, "run", "build"
      info "Host #{host} all done with JS"
    end
  end
end
