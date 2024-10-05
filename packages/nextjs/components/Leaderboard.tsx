/* eslint-disable @next/next/no-img-element */

/**
 * Site footer
 */
import { Link } from "lucide-react";
import Image from "next/image";
import { ISponsor } from "~~/types/ISponsor";

interface LeaderboardProps {
  sponsors: ISponsor[];
}

export const Leaderboard = ({ sponsors }: LeaderboardProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Sponsor</th>
            <th>Sponsored Amount</th>
            <th>Bio</th>
            <th>Talent Passport</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  <div className="mask mask-squircle h-12 w-12">
                    <Image src="" alt="Avatar Tailwind CSS Component" />
                  </div>
                </div>
                <div>
                  <div className="font-bold">Hart Hagerty</div>
                  <div className="text-sm opacity-50">100</div>
                </div>
              </div>
            </td>
            <td>
              <div className="badge badge-accent">2 ETH</div>
            </td>
            <td>Helping Builders</td>
            <th>
              <button className="btn btn-ghost">
                <Link className="w-5 h-5 text-blue-500" />
              </button>
            </th>
          </tr>
          {sponsors.map(sponsor => (
            <tr key={sponsor.wallet}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <div className="avatar">
                        <div className="rounded-full">
                          <img src={sponsor.profile_picture_url} alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{sponsor.name || sponsor.wallet}</div>
                    <div className="text-sm opacity-50">{sponsor.builder_score}</div>
                  </div>
                </div>
              </td>
              <td>
                <div className="badge badge-accent">{sponsor.total_amount} ETH</div>
              </td>
              <td>{sponsor.bio}</td>
              <th>
                {sponsor.talent_passport_id && (
                  <button className="btn btn-ghost">
                    <Link
                      className="w-5 h-5 text-blue-500"
                      href={`https://passport.talentprotocol.com/profile/${sponsor.talent_passport_id}`}
                      target="_blank"
                    />
                  </button>
                )}
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
