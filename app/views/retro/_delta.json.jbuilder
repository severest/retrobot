json.type 'delta'
json.(delta, :id, :notes)
json.content Base64.encode64(delta.content)
json.userId delta.user
json.votes do
  json.array! delta.delta_votes.pluck(:user)
end
