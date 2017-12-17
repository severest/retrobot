require 'test_helper'

class TeamTest < ActiveSupport::TestCase
  test "create team with no password" do
    assert_difference 'Team.count', 1 do
      Team.create(name: "test")
    end
  end

  test "cant create team with no name" do
    assert_no_difference 'Team.count' do
      Team.create
    end
  end

  test "create team with password" do
    assert_difference 'Team.count', 1 do
      Team.create(name: "test", password: 'password')
    end
  end

  test "create team with stripped and downcase name" do
    t = Team.create(name: "  Some Team NAME??!")
    assert_equal t.name, "some team name??!"
  end

  test "find_or_create team with just name" do
    t = Team.find_or_create(name: "  TEAM ONE")
    assert_equal t.id, teams(:one).id
  end

  test "find_or_create team with new name" do
    assert_difference 'Team.count', 1 do
      t = Team.find_or_create(name: "a brand new team")
    end
  end

  test "find_or_create team with new name and password" do
    assert_difference 'Team.count', 1 do
      t = Team.find_or_create(name: "a brand new team", password: 'hehe')
      assert_equal t.password, 'hehe'
    end
  end

  test "find_or_create password protected team" do
    password_protected_team = teams(:password_protected)
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name)
    end
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name, password: nil)
    end
    assert_raises(RetroNotAuthorized) do
      t = Team.find_or_create(name: password_protected_team.name, password: 'jojos')
    end
    t = Team.find_or_create(name: password_protected_team.name, password: 'testpassword')
    assert_not_nil t
  end
end
