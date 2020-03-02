class RemoveEmptyRetroTask
  include Delayed::RecurringJob
  run_every 1.day
  run_at '4:30am'
  timezone 'US/Pacific'
  queue 'default'

  def perform
    Retro.prune_old_retros
  end
end
