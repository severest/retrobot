json.(@retro, :id, :key, :status, :creator, :max_votes, :include_temperature_check)
json.time_limit @retro.time_limit_minutes
json.team @retro.team ? @retro.team.name : nil

json.deltas do
  json.array! @retro.deltas, partial: 'retro/delta', as: :delta
end
json.delta_groups @retro.delta_group_array
json.pluses do
  json.array! @retro.pluses, partial: 'retro/plus', as: :plus
end
json.prev_deltas do
  json.array! @prev_retro_deltas_without_notes, partial: 'retro/delta', as: :delta
end
json.temperature_checks do
  json.array! @retro.temperature_checks, partial: 'retro/temperature_check', as: :temperature_check
end
