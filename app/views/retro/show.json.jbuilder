json.(@retro, :id, :key)

json.deltas do
  json.array! @retro.deltas, partial: 'retro/delta', as: :delta
end
json.pluses do
  json.array! @retro.pluses, partial: 'retro/plus', as: :plus
end