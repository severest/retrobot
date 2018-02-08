set :output, "log/whenever.log"

every 1.days, at: '4:30 am' do
  runner "Retro.prune_old_retros"
end
