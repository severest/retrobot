require 'test_helper'

class TeamControllerTest < ActionDispatch::IntegrationTest
  test "get team summary" do
    post '/api/team/summary', params: { team: { name: 'team one' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['retros'].count
  end

  test "get team summary page 2" do
    team = create(:team, name: 'multipage')
    (1..32).each do |n|
      create(:retro, status: 'locked', team: team)
    end
    post '/api/team/summary', params: { page: '2', team: { name: 'multipage' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 7, json_response['retros'].count
  end

  test "get team summary page garbage" do
    team = create(:team, name: 'multipage')
    (1..32).each do |n|
      create(:retro, status: 'locked', team: team)
    end
    post '/api/team/summary', params: { page: 'jojos', team: { name: 'multipage' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 25, json_response['retros'].count
    assert_equal 32, json_response['totalRetros']
  end

  test "summary should not show in progess or voting retros" do
    post '/api/team/summary', params: { team: { name: 'permissions' } }
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 0, json_response['retros'].count
  end

  test "team summary denied with no password" do
    post '/api/team/summary', params: { team: { name: 'test team' } }
    assert_response :unauthorized
  end

  test "team summary nonexistant" do
    post '/api/team/summary', params: { team: { name: 'nonexistant' } }
    assert_response :not_found
  end

  test "team summary with password" do
    post '/api/team/summary', params: { team: { name: 'test team', password: 'testpassword' } }
    assert_response :success
  end
end
