json.type 'delta'
json.(delta, :id, :votes, :notes)
json.content Base64.encode64(delta.content)
json.userId delta.user
